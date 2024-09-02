import express from "express";
import userRoutes from "./routes/User"
export const app = express();



app.use(express.json());

app.get("/" , (req , res) => {
    return res.json({msg : "App is up and running"})
})

app.use("/api/v1/user" , userRoutes);


