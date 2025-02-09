import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createsession, successfulcheckout } from "../controllers/paymnet.controller.js";


const router = express.Router();

router.post("/checkout-session", protect,createsession)
router.post("/checkout-success", protect, successfulcheckout)
  
export default router;
