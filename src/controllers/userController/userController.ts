import { NextFunction, Request, Response } from "express";
import UserService from "../../services/userService/userService";
import logger from "../../logger/logger";
import { APP_CONSTANTS } from "../../constants/appContants";
import { setResponse } from "../../utils/helper";

const userService: any = UserService();

const UserController = () => {

    /**
     * Responsible for creating a new user on user signup
     * @param req 
     * @param res 
     */
    const createUser = async (req: Request, res: Response, next: NextFunction) => {
        logger.info(APP_CONSTANTS.USER_CONTROLLER.START);
        try {
            const userData = req?.body;
            //checking whether the registered user is already present in the DB
            const isUserExist = await userService?.isUserExist(userData);
            if(!isUserExist) {
                await userService.createUser(userData);
            } else {
               setResponse(res,APP_CONSTANTS.STATUS_CODES.CONFLICT,false, true, APP_CONSTANTS.ERROR.USER_ALREADY_EXISTS, "");
            }
            setResponse(res, APP_CONSTANTS.STATUS_CODES.CREATED,true,false,APP_CONSTANTS.SUCCESS.USER_REGISTER,"");
        } catch (err: any) {
            logger.info(APP_CONSTANTS.USER_CONTROLLER.ERROR);
            next(err); 
        }
    }

    /**
     * Responsible for logging in the authorized user
     * @param req 
     * @param res 
     */
    const loginUser = (req: Request, res: Response) => {
        try {
            const {email,password} = req?.body;
            if(!email || !password) {
                res.status(500).json({message: "required"})
            } else {
                const user = userService.loginUser(email,password);
                res.json(200).json({message: user});
            }
        } catch (err) {

        }
    }

    return {createUser, loginUser}
}

export default UserController;
