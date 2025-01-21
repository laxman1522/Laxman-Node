import { Response, NextFunction } from 'express';
import { User } from "../models/user/user";
import logger from "../logger/logger";
import { setResponse } from "../utils/helper";
import { APP_CONSTANTS } from "../constants/appContants";
import { userData } from '../interface/userInterface';


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const verifyAdmin = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user: userData | null = await User.findOne({email: req?.email});
        if(user?.role !== APP_CONSTANTS.ROLES.ADMIN) {
            return setResponse(res,APP_CONSTANTS.STATUS_CODES.FORBIDDEN,false,true, APP_CONSTANTS.ERROR.ONLY_ADMIN_ALLOWED,{})
        } 
        next();
    } catch(err) {
        logger.error(err);
        next(err);
    }

   
}

export default verifyAdmin;






