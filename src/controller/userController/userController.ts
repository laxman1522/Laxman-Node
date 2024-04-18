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
          const data = {
            accessToken: accessToken
          }
          setResponse(res,AppConstants.STATUS_CODES.CREATED,true,false,AppConstants.RESPONSE_MESSAGES.SIGNUP_SUCCESS,data);
        } else {
          setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{});
        }
      } catch (error: any) {
          if(error?.message === AppConstants.USER_ALREADY_EXIST) {
            setResponse(res,AppConstants.STATUS_CODES.SUCCESS,false,true,AppConstants.RESPONSE_MESSAGES.USER_ALREADY_EXIST,{});
          } else {
            setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true,error?.message,{});
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
          const data = {
            accessToken: accessToken
          }
          return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.LOGIN_SUCCESS,data);
        } else {
          return setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{});
        }
      } catch (error: any) {
          if(error?.message === AppConstants.USER_NOT_FOUND) {
            return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,false,true,AppConstants.RESPONSE_MESSAGES.USER_NOT_FOUND,{});
          } else if(error?.message === AppConstants.INVALID_CREDENTIALS) {
            return setResponse(res,AppConstants.STATUS_CODES.UNAUTHORIZED,false,true, AppConstants.RESPONSE_MESSAGES.USER_NOT_AUTHORIZED,{});
          } else {
            return setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR,true,false, error?.message,{});
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
      } catch (error: any) {
          if(error === AppConstants.UNAUTHORIZED) {
              return setResponse(res,AppConstants.STATUS_CODES.UNAUTHORIZED,false,true,AppConstants.RESPONSE_MESSAGES.USER_NOT_AUTHORIZED,{})
          } else if (error === AppConstants.INVALID_TOKEN) {
            return setResponse(res,AppConstants.STATUS_CODES.FORBIDDEN,false,true,AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN,{});
          } else {
            return setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false,true,error?.message, {});
          }
      }
    };

    return {createUser, login, verifyToken};

}

export default UserController;