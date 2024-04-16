import { NextFunction, Request, Response } from "express";
import UserService from "../../services/userService/userService";
import { AppConstants } from "../../constants/appConstants/appConstants";
import logger from "../../logger/logger";
import { setResponse } from "../../utils/helper";

const userService = UserService();

const UserController: any = () => {

  /**
   * Controller method responsible for creating a user 
   * @param req 
   * @param res 
   */
    const createUser = async (req: Request,res: Response) => {
      logger.info(AppConstants.CREATE_USER.CONTROLLER);
      try {
        const userName = req?.body?.username;
        const password = req?.body?.password;
        if(userName && password) {
          const accessToken = await userService.createUser(userName,password);
          setResponse(res,201,AppConstants.ACCESS_TOKEN,accessToken);
        } else {
          setResponse(res,400,AppConstants.MESSAGE,AppConstants.INVALID_REQUEST);
        }
      } catch (error: any) {
          if(error?.message === AppConstants.USER_ALREADY_EXIST) {
            setResponse(res,200,AppConstants.MESSAGE,AppConstants.USER_ALREADY_EXIST);
          } else {
            setResponse(res,500, AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
          }
      }
    }

    /**
     * Controller method responsible for logging in the user with valid credentials
     * @param req 
     * @param res 
     */
    const login = async (req: Request,res: Response) => {
      logger.info(AppConstants.LOGIN.CONTROLLER);
      try {
        const userName = req?.body?.username;
        const password = req?.body?.password;
        if(userName && password) {
          const accessToken = await userService.login(userName,password);
          return setResponse(res,201,AppConstants.ACCESS_TOKEN,accessToken);
        } else {
          return setResponse(res,400,AppConstants.MESSAGE,AppConstants.INVALID_REQUEST);
        }
      } catch (error: any) {
          if(error?.message === AppConstants.USER_NOT_FOUND) {
            return setResponse(res,200,AppConstants.MESSAGE,AppConstants.USER_NOT_FOUND);
          } else if(error?.message === AppConstants.INVALID_CREDENTIALS) {
            return setResponse(res,200, AppConstants.ERROR,AppConstants.INVALID_CREDENTIALS);
          } else {
            return setResponse(res,500, AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
          }
      }
    }

    /**
     * Controller responsible for verifying the access token
     * @param req 
     * @param res 
     * @param next 
     */
    const verifyToken = async (req:any, res: Response, next: NextFunction) => {
      try {
        const authHeader: any = req.headers[AppConstants?.AUTHORIZATION];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
        const userName =  await userService.verifyToken(token);
        req.user = userName;
        next();
      } catch (error) {
          if(error === AppConstants.UNAUTHORIZED) {
              return setResponse(res,401,AppConstants.ERROR,AppConstants.UNAUTHORIZED)
          } else if (error === AppConstants.INVALID_TOKEN) {
            return setResponse(res,403,AppConstants.ERROR,AppConstants.INVALID_TOKEN)
          } else {
            return setResponse(res,500, AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
          }
      }
    };

    return {createUser, login, verifyToken};

}

export default UserController;