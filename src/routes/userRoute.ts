
import express, { NextFunction, Request, Response, Router } from "express";
import UserController  from "../controllers/userController/userController";
import { ROUTE_CONSTANTS } from "../constants/routeConstants";
import validateSignupFields from "../middlewares/signupFieldValidation";
import validateLoginFields from "../middlewares/loginFieldValidation";
import verifyUser from "../middlewares/verifyUser";

const UserRoute: Router = express.Router();

const userController = UserController();

UserRoute.post(ROUTE_CONSTANTS.SIGNUP,validateSignupFields,userController.createUser);

UserRoute.post(ROUTE_CONSTANTS.LOGIN,validateLoginFields,verifyUser, userController.loginUser);

 export default UserRoute;