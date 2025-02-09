import Coupen from "../models/coupen.model.js";
import stripe from "../lib/stripe.js";
import Order from "../models/order.model.js"

export const createsession = async (req , res)=>{
  try {
    const { products, couponcode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "invalid or empty" });
    }
    let totalamount = 0;
    const lineitem = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalamount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: products.name,
            image: [products.image],
          },
          unit_amount: amount,
        },
      };
    });
    let coupon = null;
    if (couponcode) {
      coupon = await Coupen.findOne({
        code: couponcode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalamount -= Math.round(
          (totalamount * coupon.discountPercentage) / 100
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_item: lineitem,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}purchase-cancel`,
      discounts:coupon
      ?[
        {
          coupon: await createStripeCoupon(coupon.discountPercentage)
        },
      ] :
      [],
      metadata:{
        userId:req.user._id.toString(),
        couponcode:couponcode || "",
        product: JSON.stringify(
          products.map((p)=>{
            ({_id:p._id, quantity : p.quantity, price: p.price})
          })
        )
      }
    });

    if(totalamount > 20000){
      await newcoupon(req.user._id)
    }

    res.status(200).json({id:session.id,totalamount:totalamount /100})

  } catch (error) {

  }



  async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
      percent_off:discountPercentage,
      duration:"once"
    })
    return coupon.id
  }
  async function newcoupon(userId){
    const newcoupon = new Coupen({
      code:"GIFT"+ Math.random().toString(36).substring(2,8).toUpperCase(),
      discountPercentage:10,
      expirationDate: new Date(Date.now() + 30*24*60*60*1000),
      userId:userId
    })
    await newcoupon.save();
  
    return newcoupon;
  }
  
  }

  export const successfulcheckout = async (req, res)=>{
    try {
      const{sessionId} = req.body
      const session = await stripe.checkout.sessions.retrieve(sessionId)
  
      if(session.payment_status === "paid"){
        if(session.metadata.couponcode
        ){
          await Coupen.findOneAndUpdate({
            code:session.metadata.couponcode, userId:session.metadata.userId
          },{isActive:false})
        }
        // create new order
        const products =  JSON.parse(session.metadata.products);
        const newOrder =  new Order({
          user:session.metadata.userId,
          products:products.map(product =>({
            product:product._id,
            quantity:product.quantity,
            price:product.price,
          })),
          totalamount:session.amount_total / 100,
          stripeSessionId: sessionId
        })
        await newOrder.save()
        res.status(200).json({
          success:true,
          message:"payment successful, order created, and coupon deactivated if used",
          orderId:newOrder._id
        })
      }
    } catch (error) {
      console.error("Error in successful checkoout")
      res.status(500).json({Error:"internal server error"})
    }
  }

