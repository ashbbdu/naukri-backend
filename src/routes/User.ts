import express from "express";
import { sendOtp, signup } from "../controllers/Auth";

const router = express.Router();

router.post("/sendotp" , sendOtp)
router.post("/createuser" , signup);

export default router;