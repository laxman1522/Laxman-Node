"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../../controller/userController/userController"));
const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const userRoute = express.Router();
const userController = (0, userController_1.default)();
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
userRoute.post(routeConstants.SIGNUP, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userController.createUser(req, res);
}));
userRoute.post(routeConstants.LOGIN, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userController.login(req, res);
}));
exports.default = userRoute;
