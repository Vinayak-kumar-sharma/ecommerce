import mongoose from "mongoose";

export const connecttoDB = async()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGODB)
    console.log("Connected to Db: "+ conn.connection.host)
  } catch (error) {
    console.error("Oops database need to connect: "+error)
    process.exit(1)
  }
}