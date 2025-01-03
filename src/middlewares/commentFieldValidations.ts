import { Request, Response, NextFunction } from 'express';
import { APP_CONSTANTS, COMMENT_FIELDS } from '../constants/appContants';
import { setResponse } from '../utils/helper';
import Joi from 'joi';


// Define the Joi schema
const commentSchema = Joi.object({
  comment: Joi.string().required(),
}).unknown(false);

/**
 * responsible for validating the request body for signup
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const validateCommentFields = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
      // Validate the request body against the schema
      await commentSchema.validateAsync(req.body, { abortEarly: false });
      next(); // Proceed to the next middleware if validation passes
    } catch (err: any) {
      // Return validation error response
      const errorMessages = err.details.map((detail: Joi.ValidationErrorItem) => detail.message);
      res.status(400).json({
        status: "error",
        success: false,
        errors: errorMessages,
      });
    }
};

export default validateCommentFields;