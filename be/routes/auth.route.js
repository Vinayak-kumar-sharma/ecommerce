import express from "express"
import { login, logout, refresh, signup } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/logout",logout)
router.post("/login",login)
router.post("/refresh",refresh)
// router.get("/profile",profile)




export default router