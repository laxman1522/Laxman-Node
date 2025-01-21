
import express, { Router } from "express";
import UserController  from "../controllers/userController/userController";
import { ROUTE_CONSTANTS } from "../constants/routeConstants";
import validateSignupFields from "../middlewares/signupFieldValidation";
import validateLoginFields from "../middlewares/loginFieldValidation";
import verifyAdmin from "../middlewares/verifyAdmin";
import verifyToken from "../middlewares/verifyToken";

const UserRoute: Router = express.Router();

const userController = UserController();

UserRoute.post(ROUTE_CONSTANTS.SIGNUP,validateSignupFields,userController.createUser);

UserRoute.post(ROUTE_CONSTANTS.LOGIN,validateLoginFields, userController.loginUser);

UserRoute.get(ROUTE_CONSTANTS.PENDING, verifyToken, verifyAdmin, userController.fetchPendingUser);

UserRoute.post(ROUTE_CONSTANTS.APPROVE, verifyToken, verifyAdmin, userController.approveUser )

 export default UserRoute;