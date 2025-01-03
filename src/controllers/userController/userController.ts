import { NextFunction, Request, Response } from "express";
import UserService from "../../services/userService/userService";
import logger from "../../logger/logger";
import { APP_CONSTANTS } from "../../constants/appContants";
import { setResponse, timeDifference } from "../../utils/helper";
import { userData } from "../../interface/userInterface";

const userService: any = UserService();

const UserController = () => {

    /**
     * Responsible for creating a new user on user signup
     * @param req 
     * @param res 
     */
    const createUser: any = async (req: Request, res: Response, next: NextFunction) => {
        //logger
        logger.info(APP_CONSTANTS.USER_CONTROLLER.CREATE_USER.START);
        let isAdmin = false;
        try {
            const userData = req?.body;
            //checking whether the registered user is already present in the DB
            const userDetails: userData = await userService?.existingUser(userData?.email, userData?.employeeId);
            if(!userDetails || !Object.keys(userDetails)?.length) {
                isAdmin = await userService.createUser(userData, false);
            } else {
                let message = "";
                if(userDetails.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.APPROVED) {
                    message = APP_CONSTANTS.ERROR.USER_ALREADY_EXISTS;
                } else if (userDetails.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.PENDING) {
                    message = APP_CONSTANTS.ERROR.USER_ALREADY_REGISTERED_PENDING;
                } else if (userDetails.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.REJECTED) {
                    const updatedTime = await userService.getUpdatedTime(req?.body?.email);
                    const diffInDays = timeDifference(updatedTime);
                   
                    if(diffInDays < 2) {
                        message = APP_CONSTANTS.ERROR.USER_ALREADY_REGISTERED_REJECTED;
                    } else {
                        await userService.createUser(userData, true);
                        message = APP_CONSTANTS.ERROR.USER_ALREADY_REREGISTERED;
                    }
                    
                }
               return setResponse(res,APP_CONSTANTS.STATUS_CODES.CONFLICT,false, true, message, "");
            }
            //logger
            logger.info(APP_CONSTANTS.USER_CONTROLLER.CREATE_USER.ENDED);
            return setResponse(res, APP_CONSTANTS.STATUS_CODES.CREATED,true,false,isAdmin ? APP_CONSTANTS.SUCCESS.USER_REGISTER : APP_CONSTANTS.SUCCESS.USER_PENDING,"");
        } catch (err: any) {
            //logger
            logger.error(APP_CONSTANTS.USER_CONTROLLER.CREATE_USER.ERROR);
            next(err);  
        }
    }

    /**
     * Responsible for logging in the authorized user
     * @param req 
     * @param res 
     */
    const loginUser: any = async (req: Request, res: Response, next: NextFunction) => {
        logger.info(APP_CONSTANTS.USER_CONTROLLER.LOGIN_USER.START);
        try {
            const {email,password} = req?.body;
            const user = await userService.loginUser(email,password);
            logger.info(APP_CONSTANTS.USER_CONTROLLER.LOGIN_USER.ENDED);
            return setResponse(res,APP_CONSTANTS.STATUS_CODES.SUCCESS,true,false,APP_CONSTANTS.SUCCESS.USER_LOGIN,user);
        } catch (err) {
            logger.info(APP_CONSTANTS.USER_CONTROLLER.LOGIN_USER.ERROR, err);
            next(err);
        }
    }

      /**
       * 
       * @param req 
       * @param res 
       * @param next 
       * @returns 
       */
      const fetchPendingUser: any = async (req: any, res: Response, next: NextFunction) => {
        logger.info(APP_CONSTANTS.USER_CONTROLLER.PENDING_USER.START);
        try {
            const user = await userService.fetchPendingUser();
            logger.info(APP_CONSTANTS.USER_CONTROLLER.PENDING_USER.ENDED);
            return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.USER_FETCH,{user: user});
        } catch (err: any) {
            logger.error(APP_CONSTANTS.USER_CONTROLLER.PENDING_USER.ERROR,err);
            next(err);
        }
         }

        /**
         * 
         * @param req 
         * @param res 
         * @param next 
         */
        const approveUser: any = async (req: any, res: Response, next: NextFunction) => {
            logger.info(APP_CONSTANTS.USER_CONTROLLER.APPROVE_USER.START);
            try {
                //checking whether the registered user is already present in the DB
                const isUserExist = await userService?.isUserExist(req.body?.email);

                if(!isUserExist) {
                    return setResponse(res,APP_CONSTANTS.STATUS_CODES.NOT_FOUND,false, true, APP_CONSTANTS.ERROR.INVALID_USER, "");
                } else {
                   const user = await userService.approveUser(req.body?.email);

                   if(!user) {
                     return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, false, true, APP_CONSTANTS.ERROR.REJECTED, "");
                   }
                }
                logger.info(APP_CONSTANTS.USER_CONTROLLER.APPROVE_USER.ENDED);
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.USER_APPROVED, {});
            } catch(err: any) {
                logger.info(APP_CONSTANTS.USER_CONTROLLER.APPROVE_USER.ERROR, err);
                next(err);
            }
        }

    return {createUser, loginUser, fetchPendingUser, approveUser}
}

export default UserController;

