import express from "express"
import { protect } from "../middleware/auth.middleware.js"
import { getcoupen, validate } from "../controllers/coupen.controller.js"

const router = express.Router()

router.get("/",protect,getcoupen)
router.get("/validate",protect,validate)

export default router