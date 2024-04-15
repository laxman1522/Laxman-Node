import { Request, Response } from "express";
import UserService from "../../services/userService/userService";
import { AppConstants } from "../../constants/appConstants/appConstants";
import logger from "../../logger/logger";

const userService = UserService();

const UserController: any = () => {

    const createUser = async (req: Request,res: Response) => {
      logger.info(AppConstants.CREATE_USER.CONTROLLER);
      await userService.createUser(req,res);
    }

    const login = async (req: Request,res: Response) => {
      await userService.login(req,res);
    }

    /**
     * Controller responsible for verifying the access token
     * @param req 
     * @param res 
     * @param next 
     */
    const verifyToken = async (req: any, res: any, next: any) => {
      await userService.verifyToken(req,res,next);
    };

    return {createUser, login, verifyToken};

}

export default UserController;