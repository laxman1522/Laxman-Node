import UserController from "../../controller/userController/userController";
import { Request, Response } from "express";

const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const userRoute = express.Router();
const userController = UserController();

userRoute.post(routeConstants.SIGNUP,async (req: Request,res: Response) => {
    userController.createUser(req,res);
});

userRoute.post(routeConstants.LOGIN,async (req: Request,res: Response) => {
    userController.login(req,res);
});

export default userRoute;