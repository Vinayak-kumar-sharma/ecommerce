import Stripe from "stripe";
import dotenv from "dotenv"

dotenv.config()
const stripe = new Stripe(process.env.SECRET_KEY)

export default stripe