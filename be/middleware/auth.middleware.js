import jwt, { decode } from "jsonwebtoken"
import User from "../models/users.model.js"

export const protect = async(req ,res,next)=>{
  try {
    const accessToken = req.cookies.accessToken
    if(!accessToken){
      return res.status(401).json({error:"unauthorized"})
    }
    const decode = jwt.verify(accessToken,process.env.JWT)
    const user =  await User.findById(decode.userId).select("-password")
    if(!user){
      return res.status(401).json({error:"not the valid user"})
    }
    req.user = user
    next()
  } catch (error) {
    console.log("error in protect route")
    res.status(500).json({error:"internal server error."})
  }
}

export const adminroute = async(req,res,next)=>{
  try {
    if(req.user && req.user.role === "admin"){
      next()
    }
    else{
      return res.status(403).json({Error:"AccessDenied"})
    }
  } catch (error) {
    
  }
}