import { z } from "zod"
export const createUserSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    organisation: z.string(),
    profilePic: z.string().optional(),
    currentLocation: z.string().optional()
})

// export const loginSchema = z.object({
//     email : 
// })