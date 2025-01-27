import { NextFunction, Request, Response } from "express";
import UserService from "../../services/userService/userService";
import logger from "../../logger/logger";
import { APP_CONSTANTS } from "../../constants/appContants";
import { setResponse, timeDifference, verifypassword } from "../../utils/helper";
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

        try {
            const userData = req?.body;

            //checking whether the registered user is already present in the DB
            const userDetails: userData = await userService?.getExistingUser(userData?.email, userData?.employeeId);

            let cdwWalletUserData = await userService.getCdwWalletUserData(userData?.email, userData?.employeeId);

            if(!cdwWalletUserData?.isValidUser) {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.NOT_FOUND,false,true,APP_CONSTANTS.ERROR.INVALID_EMAIL_EMPLOYEE_ID,"");
            } else if(!userDetails || !Object.keys(userDetails)?.length) {
                await userService.createUser(userData, cdwWalletUserData?.isAdmin);
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.CREATED,true,false,cdwWalletUserData?.isAdmin ? APP_CONSTANTS.SUCCESS.USER_REGISTER : APP_CONSTANTS.SUCCESS.USER_PENDING,"");
            } else {
                if(userDetails.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.APPROVED) {
                    return setResponse(res,APP_CONSTANTS.STATUS_CODES.CONFLICT,false, true, APP_CONSTANTS.ERROR.USER_ALREADY_EXISTS, "");
                } else if (userDetails.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.PENDING) {
                    return setResponse(res,APP_CONSTANTS.STATUS_CODES.CONFLICT,false, true, APP_CONSTANTS.ERROR.USER_ALREADY_REGISTERED_PENDING, "");
                } else if (userDetails.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.REJECTED) {

                    const updatedTime = await userService.getUpdatedTime(req?.body?.email);
                    const diffInDays = timeDifference(updatedTime);
                   
                    if(diffInDays < 2) {
                        return setResponse(res,APP_CONSTANTS.STATUS_CODES.CONFLICT,false, true, APP_CONSTANTS.ERROR.USER_ALREADY_REGISTERED_REJECTED, "");
                    } else {
                        await userService.updateUser(userData);
                        return setResponse(res, APP_CONSTANTS.STATUS_CODES.CREATED, true, false, APP_CONSTANTS.ERROR.USER_REREGISTERED, "");
                    }
                }
            }
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

            //checking whether the registered user is present in the DB
            const userDetails: userData = await userService?.getExistingUser(email);

            if(!userDetails || !Object.keys(userDetails)?.length) {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.NOT_FOUND, false, true, APP_CONSTANTS.ERROR.USER_NOT_EXIST, "");
            } else if(userDetails?.approvalStatus !== APP_CONSTANTS.APPROVAL_STATUS.APPROVED) {
                return setResponse(res,APP_CONSTANTS.STATUS_CODES.UNAUTHORIZED, true, false, APP_CONSTANTS.ERROR.UNVERIFIED_USER,[]);
            } else {

                const isPasswordMatching = await verifypassword(userDetails?.password!, password);

                if(isPasswordMatching) {
                    const user = await userService.loginUser(email);
                    return setResponse(res,APP_CONSTANTS.STATUS_CODES.SUCCESS,true,false,APP_CONSTANTS.SUCCESS.USER_LOGIN,user);
                } else {
                    return setResponse(res, APP_CONSTANTS.STATUS_CODES.UNAUTHORIZED, false, true, APP_CONSTANTS.ERROR.INVALID_PASSWORD, "");
                }

            }
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
        const approveRejectUser: any = async (req: any, res: Response, next: NextFunction) => {
            logger.info(APP_CONSTANTS.USER_CONTROLLER.APPROVE_USER.START);
            try {
                //checking whether the registered user is already present in the DB
                const userDetails = await userService?.getExistingUser(req.body?.email);

                if(!userDetails || !Object.keys(userDetails)?.length) {
                    return setResponse(res,APP_CONSTANTS.STATUS_CODES.NOT_FOUND,false, true, APP_CONSTANTS.ERROR.INVALID_USER, "");
                } else if(userDetails?.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.REJECTED) {
                    return setResponse(res, APP_CONSTANTS.STATUS_CODES.FORBIDDEN, false, true, APP_CONSTANTS.ERROR.USER_ALREADY_REGISTERED_REJECTED,"");
                } else if(userDetails?.approvalStatus === APP_CONSTANTS.APPROVAL_STATUS.APPROVED) {
                    return setResponse(res, APP_CONSTANTS.STATUS_CODES.FORBIDDEN, false, true, APP_CONSTANTS.ERROR.USER_ALREADY_APPROVED,"");
                } else {

                    if(req?.body?.isValidUser) {
                        const user = await userService.approveUser(req.body?.email, userDetails?.employeeId);

                        if(!user) {
                            return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, false, true, APP_CONSTANTS.ERROR.REJECTED, "");
                        } else {
                            return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.USER_APPROVED, {});
                        }
                    } else {
                        await userService.rejectUser(req.body?.email);
                        return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.ERROR.REJECTED_SUCCESSFULLY, "");
                    }
                   
                }
                
            } catch(err: any) {
                logger.info(APP_CONSTANTS.USER_CONTROLLER.APPROVE_USER.ERROR, err);
                next(err);
            }
        }

    return {createUser, loginUser, fetchPendingUser, approveRejectUser}
}

export default UserController;

