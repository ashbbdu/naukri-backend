import express from "express";
import { createUser, sum } from "../controllers/User";

const router = express.Router();

router.post("/createuser" , createUser);
router.post("/sum" , sum)

export default router;