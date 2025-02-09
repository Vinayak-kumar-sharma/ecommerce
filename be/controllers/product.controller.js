import cloudinary from "../lib/cloudinary.js"
import { redis } from "../lib/redis.js"
import Product from "../models/products.model.js"


export const getProducts = async(req,res)=>{
  try {
    const product = await Product.find({})
    res.json({ product })

  } catch (error) {
    console.log("proctuct geting error")
    res.status(500).json({error:"internal server error."})
  }
}
export const getfeatureProduct = async (req,res)=>{
  try {
    let featureProducts = await redis.get('featured_product')
    if(featureProducts){
      return res.json(JSON.parse(featureProducts))
    }
    featureProducts = await Product.find({isFeatured:true}).lean()
    if(!featureProducts){
      return res.status(404).json({error: "not found"})
    }
    // update the cache
    await redis.set("featured_product",JSON.stringify(featureProducts))

    res.json(featureProducts)
  } catch (error) {
    console.log("error in the products getting featured")
    res.status(500).json({error:"internal server error"})
  }
}

export const newproducts = async(req , res)=>{
  try {
    const {name,price,description,image,category} = req.body
    let clodinaryresponse = null
    if(image){
      clodinaryresponse =  await cloudinary.uploader.upload(image,{folder:"products"})
    }
    const product = await Product.create({
      name,
      description,
      image:clodinaryresponse.secure_url? clodinaryresponse.secure_url:"",
      price,
      category
    })

    res.status(200).json(product)
  } catch (error) {
    console.log("Error in creating new products")
    res.status(500).json(error.message)
  }
}
export const deleteproducts =async(req , res)=>{
  try {
    const product = await Product.findById(req.params.id)

    if(!product){
      return res.status(404).json({Error:"Product not found ."})
    }
    if(product.image){
      const publicID = product.image.split("/").pop().split(".")[0]
      await cloudinary.uploader.destroy(`folder/${publicID}`)
      console.log("Image is deleted from cloudinary")
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"deleted"})
  } catch (error) {
    console.log("Error in deleting products")
    res.status(500).json({error:"internal server error"+error.message})
  }
}
export const getsuggested = async (req , res)=>{
  try {
    const product = await Product.aggregate([
      {
        $sample:{size:3}
      },{
        $project:{
          _id:1,
          name:1,
          description:1,
          image:1,
          price:1
        }
      }
    ])

    res.json(product)

  } catch (error) {
    console.log("Error in recommendations")
    res.status(500).json({Error:"Error in server"})
  }
}

export  const getcategory =async(req , res)=>{
  try {
    const {category} =  req.params
    const product = await Product.find({category})
    res.json(product)
  } catch (error) {
    console.log("error in category")
    res.status(500).json({message:"internal server error"})
  }
}

export const togglefeature = async (req ,res)=>{
  try {
    const product = await Product.find(req.params.id)
    if(product){
      product.isFeatured = !product.isFeatured
      const updateProduct = await product.save()
      await updatefeatureproductcache()
      res.json(updateProduct)
    }
    else{
      res.status(404).json({error:"product not found ."})
    }
  } catch (error) {
    console.log("error in the toggle the product")
    res.status(500).json({error:"internal server error.."})
  }
}
async function updatefeatureproductcache (){
  try {
    const featureProduct = await Product.find({isFeatured:true}).lean() // share plain javascript unlik the mongoose documnet to enhance the perfomance
    await redis.set("feature_products",JSON.stringify(featureProduct))
  } catch (error) {
    console.log("error in the updating the cache ")
    
  }
}