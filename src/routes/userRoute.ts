
import express, { Request, Response, Router } from "express";
import UserController  from "../controllers/userController/userController";
import { ROUTE_CONSTANTS } from "../constants/routeConstants";
import validateSignupFields from "../middlewares/signupFieldValidation";

const UserRoute: Router = express.Router();

const userController = UserController();

UserRoute.post(ROUTE_CONSTANTS.SIGNUP,validateSignupFields, userController.createUser);

UserRoute.post(ROUTE_CONSTANTS.LOGIN, async (req: Request, res: Response) => {
    userController?.loginUser(req,res);
})

 export default UserRoute;