import { Response,NextFunction } from "express";
import { APP_CONSTANTS } from "../constants/appContants";
import logger from "../logger/logger";
import UserService from "../services/userService/userService";
import { setResponse } from "../utils/helper";

const userService: any = UserService();

 /**
     * Middleware responsible for verifying the access token
     * @param req 
     * @param res 
     * @param next 
     */
 const verifyToken: any = async (req:any, res: Response, next: NextFunction) => {
    try {
      const authHeader: any = req.headers[APP_CONSTANTS?.AUTHORIZATION];
      const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
      logger.info(token);
      if(token) {
        const decodedValue =  await userService.verifyToken(token); 
        req.email = decodedValue?.email;
        next();
      } else {
        return setResponse(res,APP_CONSTANTS.STATUS_CODES.FORBIDDEN,false,true,APP_CONSTANTS.RESPONSE_MESSAGES.INVALID_TOKEN,{});
      }
      
    } catch (err: any) {
       logger.error(err);
       next(err);
    }
  };

  export default verifyToken;