import Coupen from "../models/coupen.model.js"
export const getcoupen = async(req,res)=>{

  try {
    const coupon = await Coupen.findOne({userId:req.user._id,isActive:true})
    res.json(coupon || null);
  } catch (error) {
    console.log("error in getting coupon")
  res.status(500).json({error:"internal server error"})
  }
}

export const validate = async (req,res)=>{
  try {
    const {code}= req.body;
    const coupon =await Coupen.findOne({code:code,userId:req.user._id,isActive:true})
    if(!coupon){
      return res.status(404).json({message:"coupon not found"})
    }
    if(coupon.expirationDate < new Date()){
      coupon.isActive =false;
      await coupon.save()
      return res.status(404).json({message:'Coupon expired'})
    }
    res.json({
      message:"Coupon is valid",
      code:coupon.code,
      discountPercentage:coupon.discountPercentage,

    })
  } catch (error) {
    console.log("error in validation of coupon")
    res.status(500).json({error:"error"})
  }
}