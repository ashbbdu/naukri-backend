import { Request, Response } from "express";
import { createUserSchema } from "../schema/user";
import  { prismaClient }  from "../db"
// import { prismaClient } from "../__mocks__/db";

export const createUser = async (req : Request , res : Response) => {
    const { email , firstName , lastName , organisation , profilePic , currentLocation } = req.body;

    try {

        if(!email || !firstName || !lastName || !organisation || profilePic || currentLocation) {
            return res.status(411).json({
                msg : "Please fill in all the details !"
            })
        }
        const existinguser = await prismaClient.user.findUnique({
            where : {
                email : req.body.email
            }
        })
        if(existinguser) {
            return res.status(411).json({
                msg : "User already registered with us , try signing in !"
            })
        }
        const userinputs = createUserSchema.safeParse(req.body);
        console.log(userinputs , "userin");
        if(!userinputs.success) {
            return res.status(411).json({
                msg : "Invalid Inputs !"
            })
        }

        const user = await prismaClient.user.create({
            data : {
                email : userinputs.data.email,
                firstName : userinputs.data.firstName,
                lastName : userinputs.data.lastName,
                organisation : userinputs.data.organisation,
                profilePic : userinputs.data.profilePic,
                currentLocation : userinputs.data.currentLocation
            }
        })

        console.log(user , "user");
        
        return res.status(200).json({
            msg : "User created successfully !",
            user
        })

    } catch (e) {
        console.log(e);
        
    }

}
