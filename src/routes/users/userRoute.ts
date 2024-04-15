import UserController from "../../controller/userController/userController";
import { Request, Response } from "express";

const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const router = express.Router();
const userController = UserController();

router.post(routeConstants.SIGNUP,async (req: Request,res: Response) => {
    userController.createUser(req,res);
});

router.post(routeConstants.LOGIN,async (req: Request,res: Response) => {
    userController.login(req,res);
});

export default router;