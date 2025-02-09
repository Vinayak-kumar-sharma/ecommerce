import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"


import { connecttoDB } from "./lib/db.js"
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/product.route.js"
import cartRoute from "./routes/cart.route.js"
import coupenRoute from "./routes/coupen.route.js"
import paymentRoute from "./routes/payment.route.js"
import analyticsRoute from "./routes/analytic.route.js"


const app = express()
dotenv.config()
const PORT = 5000
app.use(express.json()) // allow to access request object
app.use(cookieParser())

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/cart",cartRoute)
app.use("/api/v1/coupens",coupenRoute)
app.use("/api/v1/payments",paymentRoute)
app.use("/api/v1/analytics",analyticsRoute)





app.listen(PORT,()=>{
  console.log("App is listening: http://localhost:"+PORT)
  connecttoDB()
})