import bcrypt from "bcrypt";
import { Response } from "express";
import axios from "axios";
import { APP_CONSTANTS, REQUEST_METHODS } from "../constants/appContants";
import logger from "../logger/logger";

/**
 * Method for hashing the password
 * @param password 
 * @returns 
 */
const hashPassword = async (password: string) => {
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

/**
 * Method for verifying the password
 * @param existingPassword 
 * @param userPassword 
 * @returns 
 */
const verifypassword = async (existingPassword: string,userPassword: string) => {
    const isPasswordMatching =  await bcrypt.compare(userPassword, existingPassword);
    return isPasswordMatching;
}

/**
 * Method for calculating the time difference
 * @param updatedTime 
 * @returns 
 */
const timeDifference = (updatedTime: string) => {
  const currentDate: any = new Date(); // Current date
  const targetDate: any = new Date(updatedTime); // Target date from the input
  const differenceInTime = currentDate - targetDate; // Difference in milliseconds
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert to days
  return differenceInDays;
}

/**
 * To parse the data
 * @param data 
 * @returns 
 */
const parseData = (data: any) => {
    try {
      return JSON.parse(data);
    } catch(err) {
      return null;
    }
   }

/**
 * Responsible for sending the response with proper structure
 * @param res 
 * @param status 
 * @param success 
 * @param error 
 * @param message 
 * @param data 
 * @returns 
 */
const setResponse = (res: Response, status: number, success: boolean,error: boolean,message: string, data: any) => {
    return res.status(status).json({
      success: success,
      error: error,
      message: message,
      data: data
    });
 }

/**
 * Method for doing the API operations
 * @param url 
 * @param method 
 * @param headers 
 * @param body 
 * @returns 
 */
 const apiHandler = async (url: string, method: string = REQUEST_METHODS.GET, headers: object = {}, body: any = null ) => {
    try {
      const response = await axios({
        url,
        method,
        headers,
        data: body,
      });

      return response.data; // Return the response data
    } catch(err: any) {
        logger.error(err);
        const error: any = err?.message;
        error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
        throw error;
    }
 }

export {hashPassword, verifypassword, parseData, setResponse, timeDifference, apiHandler}