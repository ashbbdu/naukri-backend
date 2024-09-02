import { Request , Response } from "express";
import { prismaClient } from "../db";
import { createUserSchema } from "../schema/user";
import { mailSender } from "../utils/mailSender";
import otpGenerator from "otp-generator";


export const sendOtp = async (req: Request, res: Response) => {
    try {
      const email: string = req.body.email;
      if (!email) {
        return res.status(411).json({
          success: false,
          message: "Invalid Input",
        });
      }
  
      const existingUser = await prismaClient.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log(existingUser, "exi");
  
      if (existingUser?.email === email) {
        return res.status(411).json({
          success: false,
          message: "User is alreay registered with us !",
        });
      }
  
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      const send = await prismaClient.otp.create({
        data: {
            email,
            otp : parseInt(otp)
        },
      });
  
      mailSender(
        "OTP Send Successfully",
        email,
        `Hi , 
          Hello , Greeting of the day.
          Thanks for registering with us.
          Please enter otp ${otp} to continue with the signup process.
          Thanks
          `
      );
  
      console.log(send , "Send");
      
      res.status(200).json({
        success: true,
        message: "Otp sent successfully !",
        otp,
      });
    } catch (error) {
      console.log(error, "error");
      return res.status(411).json({
        success: false,
        message: "Something went wrong !",
      });
    }
  };
  


export const signup = async (req : Request , res : Response) => {
    const { email , firstName , lastName , organisation , profilePic , currentLocation } = req.body;

    try {

        if(!email || !firstName || !lastName || !organisation ) {
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
        return res.status(411).json({
            msg : "Something went wrong !"
        })
    }

}
// export const signin = async (req : Request , res : Response) => {
//     try {
        
//     } catch (e) {
//         console.log(e);
//         return res.status(411).json({
//             msg : "Something went wrong !"
//         })
//     }
// }