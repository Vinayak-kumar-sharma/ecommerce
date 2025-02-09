import express from "express"
import { adminroute, protect } from "../middleware/auth.middleware.js"
import { getAnalyticData, getDailySalesDate } from "../controllers/analytic.controller.js";

const router = express.Router()

router.get("/",protect,adminroute,async(req , res)=>{
  try {
    const analyticsdata = await getAnalyticData();

    const startDate = new Date();
    const endDate = new Date(endDate.getTime() - 7*24*60*60 *1000);
    const dailysaledate = await getDailySalesDate(startDate,endDate)

    res.json({
      analyticsdata,
      dailysaledate
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"internal server error"})
  }
})

export default router