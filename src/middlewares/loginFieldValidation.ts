import { Response, NextFunction } from 'express';
import { APP_CONSTANTS } from '../constants/appContants';
import { setResponse } from '../utils/helper';
import Joi from 'joi';


// Define Joi schema based on the userData interface
const userDataSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});


/**
 * responsible for validating the request body for login
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const validateLoginFields = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
      // Validate the request body against the schema
      await userDataSchema.validateAsync(req.body, { abortEarly: false });
  
      // Proceed to the next middleware if validation passes
      next();
    } catch (error: any) {
      if (error.isJoi) {
        // Extract and format error messages
        const errorMessages = error.details.map((detail: Joi.ValidationErrorItem) => detail?.message);
  
        setResponse(
          res,
          APP_CONSTANTS.STATUS_CODES.BAD_REQUEST,
          false,
          true,
          errorMessages.join(", "),
          ""
        );
      } else {
        setResponse(
          res,
          APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
          false,
          true,
         APP_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR,
          ""
        );
      }
    }
};

export default validateLoginFields;