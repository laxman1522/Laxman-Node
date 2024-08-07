import UserController from "../../controller/userController/userController";
import { Request, Response } from "express";
import {User,Test}  from "../../model/userModal";

const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const userRoute = express.Router();
const userController = UserController();
  

// userRoute.post('/create', async (req: any, res: any) => {

//     try {
//         const userData = new User(req.body);
//         const {email} = userData;

//         const userExist = await User.findOne({email});
//         if(userExist) {
//             return res.status(400).json({message: "user already exist"})
//         } else {
//             const savedUser = await userData.save();
//             return res.status(200).json({message: "Data saved successfully", data: savedUser})
//         }
//     } catch (err) {
//         return res.status(500).json({message: err})
//     }
// })

// userRoute.post('/createe', async (req: any, res: any) => {

//     try {
//         const testData = new Test(req.body);
//         const {email} = testData;

//         const userExist = await User.findOne({email});
//         if(userExist) {
//             return res.status(400).json({message: "user already exist"})
//         } else {
//             const savedUser = await testData.save();
//             return res.status(200).json({message: "Data saved successfully", data: savedUser})
//         }
//     } catch (err) {
//         return res.status(500).json({message: err})
//     }
// })

// userRoute.get('/fetch', async (req: any, res: any) => {

//     try {
//         const users = await User.find();
//         if(!users.length) {
//             return res.status(404).json({message: "Not Found"})
//         } else {
//             return res.status(200).json({message: "Fetched Successfully", data: users});
//         }
//     } catch (err) {
//         return res.status(500).json({message: err})
//     }
// })

userRoute.post(routeConstants.SIGNUP,async (req: Request,res: Response) => {
    userController.createUser(req,res);
});

userRoute.post(routeConstants.LOGIN,async (req: Request,res: Response) => {
    userController.login(req,res);
});

export default userRoute;