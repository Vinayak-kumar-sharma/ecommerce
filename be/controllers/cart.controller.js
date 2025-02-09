import Product from "../models/products.model.js"

export const addtocart = async (req,res)=>{
  try {
    const {productId} = req.body
    const user = req.user
    const isitemexist = user.cartItem.find((item) => item.id === productId)
    if(isitemexist){
      isitemexist.quantity += 1
    }
    else{
      user.cartItem.push(productId)
    }
    await user.cartItem.save()
    res.json(user.cartItem)
  } catch (error) {
    console.log("error in cart items")
    res.status(500).json({message:"internal server error"})
  }
}

export const removeall = async (req,res)=>{
  try {
    const {productId} = req.body
    const user = req.user;

    if(!productId){
      user.cartItem = []
    }
    else {
      user.cartItem = user.cartItem.filter((item)=>item.id !== productId)
    }
    await user.save()
    res.json(user.cartItem)
  } catch (error) {
    console.log("error in deletion")
    res.status(500).json({message:"internal server error"})
  }
}

export const updatecart = async (req,res)=>{
  try {
    const {id:productId} = req.params
    const {quantity} = req.body
    const user = req.user
    const existingitem = user.cartItem.find((item)=>item.id === productId)

    if(existingitem){
      if(quantity === 0){
        user.cartItem = user.cartItem.filter((item)=>item.id !== productId)
        await user.save()
        return res.json(user.cartItem)
      }
      existingitem.quantity = quantity;
      await user.save()
      res.json(user.cartItem)
    }
    else{
      res.status(404).json({error:"quantity of the product not found"})
    }

  } catch (error) {
    console.log("error in update controller")
    res.status(500).json({error:"internal server error.."})
  }
}
export const allcartproduct = async(req,res)=>{
  try {
    const product = await Product.find({_id:{$in:req.user.cartItem}})

    const cartitems = product.map(product =>{
      const item = req.user.cartItem.find(cartItem => cartItem.id === product.id)
      return {...product.toJSON(),quantity:item.quantity}
    })
    res.json(cartitems)
  } catch (error) {
    console.log("error in getting all the cart products.")
    res.status(500).json({message:"internal server error.."})
  }
}
