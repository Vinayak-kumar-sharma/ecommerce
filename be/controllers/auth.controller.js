import User from "../models/users.model.js"
import {redis} from "../lib/redis.js"
import jwt from "jsonwebtoken"

const generateToken = (userId)=>{
  const accessToken = jwt.sign({userId},process.env.JWT,{
    expiresIn:"15m"
  })

  const refreshToken = jwt.sign({userId},process.env.JWT_RE,{
    expiresIn:"7d"
  })
  return { accessToken, refreshToken};
}

const storeRefreshtokentoredis = async(userId,refreshToken)=>{
  await redis.set(`refreshtoken:${userId}`,refreshToken,"EX",7*24*60*60)
}
const setCookies = (req,accessToken,refreshToken)=>{
  req.cookie("accessToken",accessToken,{
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV !== "development",
    maxAge:15*60*1000
  })
  req.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV !== "development",
    maxAge:15*60*1000
  })
}
export const signup = async (req,res)=>{
  try {
    const { username,password,email} = req.body
    const userExt = await User.findOne({email})
    if(userExt){
      return res.status(400).json({Error:"Auth related error email already exists."})
    }

    const user =  await User.create({
      username, email, password
    })
    const { accessToken,refreshToken} = generateToken(user._id)
    await storeRefreshtokentoredis(user._id,refreshToken)
    setCookies(res,accessToken,refreshToken)


    res.status(200).json({
      user:{
        _id:user._id,
        email:user.email,
        name:user.username,
        role:user.role
      },message:"Success user created true"})
  } catch (error) {
    console.error("signup related error"+error)
    return res.status(500).json({Error: "Internal server error."})
  }
}
export const logout = async(req,res)=>{
  
  try {
    const refreshToken= req.cookies.refreshToken
  if(refreshToken){
    const decode = jwt.verify(refreshToken,process.env.JWT_RE)
    await redis.del(`refreshToken:${decode.userId}`)
  }
  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")
  res.json({message:"logout successfully"})

  } catch (error) {
    console.error("logout route error: "+error)
    res.status(500).json({error:"internal server error"})
  }
}

export const login =async (req,res)=>{
  try {
    const {password,email} =req.body
    const user = await User.findOne({email})
    if(user && (await user.comparePassword(password))){
      const {accessToken,refreshToken} = generateToken(user._id)
      await storeRefreshtokentoredis(user._id,refreshToken)
      setCookies(res,accessToken,refreshToken)

      res.json({
        _id:user._id,
        name:user.username,
        email:user.email
      })
    }
    else{
      res.status(400).json({message:"invalid credientials."})
    }
  } catch (error) {
    console.log("Error in login")
    res.status(500).json({message:"internal server error"})
  }
}
export const refresh = async (req,res)=>{
  try {
    const refreshToken = req.cookies.refreshToken
    console.log("client is arha h : ",refreshToken)
    if(!refreshToken){
      return res.status(401).json({message:"No refresh token is available"})
    }
    const decode = jwt.verify(refreshToken,process.env.JWT_RE)
    const storedtoken = await redis.get(`refreshtoken:${decode.userId}`)
    console.log("server se arha h: ", storedtoken)
    if(storedtoken !== refreshToken){
      return res.status(401).json({message:"invalid refresh token"})
    }
    const accessToken = jwt.sign({userId:decode.userId},process.env.JWT)
    res.cookie("accessToken",accessToken,{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development",
      maxAge:15*60*1000
    })
    res.json({message:"Token is refreshed successfully"})
  } catch (error) {
  console.log("Error in the refresh ")
  res.status(500).json({message:"internal server error."})
}
}