import express from "express";
import { createUser } from "../controllers/User";

const router = express.Router();

router.post("/createuser" , createUser);

export default router;