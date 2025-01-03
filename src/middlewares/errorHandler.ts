// middleware/errorHandler.js

import { NextFunction, Request, Response } from "express";
import logger from "../logger/logger";
import { setResponse } from "../utils/helper";
import { APP_CONSTANTS } from "../constants/appContants";

/**
 * Error handling middleware
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): any => {
    
    logger.error(err?.message);
  
    // Set the status code based on the error (default to 500 if not specified)
    const statusCode = err?.statusCode || 500;

    return setResponse(res, statusCode, false, true, err?.message || APP_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR, []);
}
  
 export default errorHandler;