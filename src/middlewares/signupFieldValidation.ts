import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { APP_CONSTANTS } from '../constants/appContants';
import { setResponse } from '../utils/helper';

// Define Joi schema based on the userData interface
const userDataSchema = Joi.object({
  name: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  profilePicture: Joi.string().uri().required(),
  profileBio: Joi.string().max(500).required(),
  latestWorkDesignation: Joi.string().required(),
  certifications: Joi.string().allow("").optional(),
  yearsOfExperiance: Joi.string().pattern(/^\d+$/).required(), // Only numeric strings
  bu: Joi.string().required(),
  workLocation: Joi.string().required(),
  employeeId: Joi.number().integer().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});


/**
 * Method to validate the signup fields
 * @param req 
 * @param res 
 * @param next 
 */
const validateSignupFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export default validateSignupFields;