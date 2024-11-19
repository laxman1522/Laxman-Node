import { Request, Response, NextFunction } from 'express';
import { APP_CONSTANTS, SIGN_UP_REQUIRED_FIELDS } from '../constants/appContants';
import { setResponse } from '../utils/helper';
import { User } from "../models/user/user";
import { userData } from '../interface/userInterface';

/**
 * responsible for validating the request body for signup
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const verifyUser = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    const user: userData | null = await User.findOne({email: req?.email});
    if(!user) {
        return setResponse(res,APP_CONSTANTS.STATUS_CODES.NOT_FOUND,false,true,APP_CONSTANTS.ERROR.USER_NOT_EXIST, [])
    } else if(!user?.approvedUser) {
        return setResponse(res,APP_CONSTANTS.STATUS_CODES.UNAUTHORIZED, true, false, APP_CONSTANTS.ERROR.UNVERIFIED_USER,[]);
    }

    // If validation passes, proceed to the next middleware or controller
    next();
};

export default verifyUser;