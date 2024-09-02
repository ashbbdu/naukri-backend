import { describe, expect, test, vi } from 'vitest';
import request from "supertest";
import { app } from '../..';
import { prismaClient } from '../../__mocks__/db';

vi.mock('../../db');


describe("/POST send otp", () => {
    test("should be able to create user successfully", async () => {
        prismaClient.user.create.mockResolvedValue({
            id: 9,
            email: 'ashishsrivastava.bbdu1111@gmail.com',
            firstName: 'Ashish',
            lastName: 'Srivastava',
            organisation: 'Compunnel Inc',
            profilePic: 'abc',
            currentLocation: 'Noida',
            createdAt: new Date("2024-09-02T13:08:50.619Z"),
            updatedAt: new Date("2024-09-02T13:08:50.619Z")
        });


        const res = await request(app).post("/api/v1/user/createuser").send({
            email: "ashishsrivastava.bbdu1111@gmail.com",
            firstName: "Ashish",
            lastName: "Srivastava",
            organisation: "Compunnel Inc",
            profilePic: "abc",
            currentLocation: "Noida"
        });
    console.log(res.body ,"rssss");
    
        expect(res.statusCode).toBe(200);
        expect(res.body.user.id).toBe(9);
        expect(res.body.user.firstName).toBe("Ashish");
    })
    test("should check if nothing is passed in the inputs", async () => {
        prismaClient.user.create.mockResolvedValue({
            id: 9,
            email: 'ashishsrivastava.bbdu1111@gmail.com',
            firstName: 'Ashish',
            lastName: 'Srivastava',
            organisation: 'Compunnel Inc',
            profilePic: 'abc',
            currentLocation: 'Noida',
            createdAt: new Date("2024-09-02T13:08:50.619Z"),
            updatedAt: new Date("2024-09-02T13:08:50.619Z")
        });
        const res = await request(app).post("/api/v1/user/createuser").send({});


        expect(res.statusCode).toBe(411);
        expect(res.body.msg).toBe("Please fill in all the details !");
    }),
    test("should be able to send otp successfully", async () => {
        prismaClient.otp.create.mockResolvedValue({
            id: 4,
            email: 'ashishsrivastava7007@gmail.com',
            otp: 947309
        });


        const res = await request(app).post("/api/v1/user/sendotp").send({
            email: "ashishsrivastava7007@gmail.com"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Otp sent successfully !");

    }),
    test("check if no inputs are passed", async () => {
            // we dont need the below line because the code execution did not reach the db call
            // prismaClient.otp.create.mockResolvedValue({ success: false, message: 'Invalid Input' });


            const res = await request(app).post("/api/v1/user/sendotp").send({});

            expect(res.statusCode).toBe(411);
            expect(res.body.message).toBe("Invalid Input");

     }),
    test("check if user already exist", async () => {
            vi.spyOn(prismaClient.user, 'findUnique').mockResolvedValue({
                id: 14,
                email: 'ashish1111@yopmail.com',
                firstName: 'Ashish',
                lastName: 'Srivastava',
                organisation: 'Compunnel Inc',
                profilePic: 'abc',
                currentLocation: 'Noida',
                createdAt: new Date("2024-09-02T19:07:30.499Z"),
                updatedAt: new Date("2024-09-02T19:07:30.499Z")
            });            

            const res = await request(app).post("/api/v1/user/sendotp").send({
                email: "ashish1111@yopmail.com"
            });
            expect(res.statusCode).toBe(411);
            expect(res.body.message).toBe("User is alreay registered with us !");

        }),
    test("should check if nothing is passed in the inputs", async () => {
            prismaClient.user.create.mockResolvedValue({
                id: 9,
                email: 'ashishsrivastava.bbdu1111@gmail.com',
                firstName: 'Ashish',
                lastName: 'Srivastava',
                organisation: 'Compunnel Inc',
                profilePic: 'abc',
                currentLocation: 'Noida',
                createdAt: new Date("2024-09-02T13:08:50.619Z"),
                updatedAt: new Date("2024-09-02T13:08:50.619Z")
            });
            const res = await request(app).post("/api/v1/user/createuser").send({});

            expect(res.statusCode).toBe(411);
            expect(res.body.msg).toBe("Please fill in all the details !");
    }),
    test("should handle errors in the catch block for create user", async () => {
        vi.spyOn(prismaClient.user, 'findUnique').mockRejectedValue(new Error("Database Error"));
        const res = await request(app).post("/api/v1/user/createuser").send({
            // naya record bnane ki koshish kra ek new error throw kr diya and catch block me chala gya
            email: "ashishsrivastava70071212@gmail.com",
            firstName: "Ashish", 
            lastName: "Srivastava", 
            organisation : "Compunnel"  
        });

        console.log(res.body, "ress");

        expect(res.statusCode).toBe(411); // Assuming the server returns 500 for internal errors
        expect(res.body.msg).toBe("Something went wrong !"); // Replac
    }),
    test("should handle errors in the catch block for send otp", async () => {
        vi.spyOn(prismaClient.user, 'findUnique').mockRejectedValue(new Error("Database Error"));
        const res = await request(app).post("/api/v1/user/sendotp").send({
            // naya record bnane ki koshish kra ek new error throw kr diya and catch block me chala gya
            email: "ashishsrivastava70071212@gmail.com",
        });

        console.log(res.body, "ress");

        expect(res.statusCode).toBe(411); // Assuming the server returns 500 for internal errors
        expect(res.body.message).toBe("Something went wrong !"); // Replac
    });
})
