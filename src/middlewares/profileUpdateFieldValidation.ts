import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the Joi schema
const profileUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  gender: Joi.string().optional(),
  profilePicture: Joi.string().uri().optional(),
  profileBio: Joi.string().optional(),
  latestWorkDesignation: Joi.string().optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  yearsOfExperiance: Joi.number().optional(),
  bu: Joi.string().optional(),
  workLocation: Joi.string().optional(),
  employeeId: Joi.string().optional(),
}).unknown(false); // Disallow additional fields

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const validateProfileUpdateFields = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Validate the request body against the schema
    await profileUpdateSchema.validateAsync(req.body, { abortEarly: false });
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


export default validateProfileUpdateFields;
