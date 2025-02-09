import express from "express"
import { protect } from "../middleware/auth.middleware.js"
import { addtocart, allcartproduct, removeall, updatecart } from "../controllers/cart.controller.js"
const router =  express.Router()

router.post("/",protect,addtocart)
router.delete("/",protect,removeall)
router.put("/:id",protect,updatecart)
router.get("/",protect,allcartproduct)


export default router