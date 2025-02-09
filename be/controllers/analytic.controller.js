import Order from "../models/order.model.js";
import Product from "../models/products.model.js";
import User from "../models/users.model.js"

export const getAnalyticData = async () =>{
  const totaluser = await User.countDocuments();
  const totalproducts = await Product.countDocuments();
  const salesdata = await Order.aggregate([
    {$group:{
      _id:null,  // group all docs together
      totalSales: {$sum:1},
      totalRevenue: {$sum:"$totalamount"}

    }}
  ])

  const {totalSales,totalRevenue} = salesdata[0] || {totalRevenue:0,totalSales:0}

  return {
    users:totaluser,
    produts:totalproducts,
    totalSales,
    totalRevenue,
  }
}

export const getDailySalesDate = async (startDate,endDate)=>{
  try {
    const dailysaledate = await Order.aggregate([
      {
        $match:{
          createdAt:{
            $gte: startDate,
            $lte: endDate
          },
      },
      },
      {
        $group:{
          _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
          sales:{$sum:1},
          revenue:{$sum:"$totalamount"}
        }
      },{ $sort: {_id:1}},
    ]) 
  
    const dateArray = getDateInRange(startDate,endDate);
    return dateArray.map(date =>{
      const foundDate = dailysaledate.find(item => item._id === date)
  
      return {
        date,
        sales:foundDate?.sales || 0,
        revenue:foundDate?.revenue || 0,
  
      }
    })
  } catch (error) {
    console.log("error in analytics geting")
    res.status(500).json({message:"internal server error "})

  }
}
  function getDateInRange(startDate,endDate){
    const dates = [];
    let currentDate = new Date(startDate)
    while(currentDate <= endDate){
      dates.push(currentDate.getData()+1);
    }
    return dates
  }
  