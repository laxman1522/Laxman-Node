import { Request, Response, NextFunction } from 'express';
import { APP_CONSTANTS, LOGIN_REQUIRED_FIELDS } from '../constants/appContants';
import { setResponse } from '../utils/helper';

/**
 * responsible for validating the request body for login
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const validateLoginFields = async (req: any, res: Response, next: NextFunction): Promise<any> => {

  // Check for missing required fields
  for (const field of LOGIN_REQUIRED_FIELDS) {
    if (!req.body[field]) {
        setResponse(res, APP_CONSTANTS.STATUS_CODES.BAD_REQUEST, false, true,`${field} is required`,"")
       return null;
    }
  }

  req.email = req?.body?.email; 

  // If validation passes, proceed to the next middleware or controller
  next();
};

export default validateLoginFields;