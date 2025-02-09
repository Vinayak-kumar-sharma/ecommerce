import express from "express"
import { deleteproducts, getcategory, getfeatureProduct, getProducts, getsuggested, newproducts, togglefeature } from "../controllers/product.controller.js"
import { protect,adminroute } from "../middleware/auth.middleware.js"
const router =  express.Router()

router.get("/",protect , adminroute,getProducts)
router.get("/feature",getfeatureProduct)
router.get("/category/:category",getcategory)
router.get("/suggested",getsuggested)
router.post("/create",protect,adminroute,newproducts)
router.patch("/:id",protect,adminroute,togglefeature)
router.delete("/:id",protect,adminroute,deleteproducts)




export default router