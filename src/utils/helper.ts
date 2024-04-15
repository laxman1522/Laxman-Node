import { Response } from "express";
import { AppConstants } from "../constants/appConstants/appConstants";
import Joi from "joi";

export const isValidDate = (date: any) => {
    const currentDate = new Date();
    const dateParts = date.split("/");
  
    // Ensure correct number of parts
    if (dateParts.length !== 3) {
      return false;
    }
  
    const [day, month, year] = dateParts;
  
    // Validate individual parts
    if (
      !Number.isInteger(parseInt(year)) ||
      !Number.isInteger(parseInt(month)) ||
      !Number.isInteger(parseInt(day))
    ) {
      return false;
    }
  
    // Attempt to create a Date object with manual parsing
    const parsedDate = new Date(year, parseInt(month) - 1, day); // Adjust month for 0-based indexing
  
    // Check for valid Date object and reasonable year range
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && (parsedDate.getTime() > currentDate.getTime());
  }


 export const getExistingUserData = (userName: string, usersData: any, param: any) => {
    // Check if username already exists
    const existingUser = usersData && usersData?.find((user: any) => user[param] === userName);
    return existingUser;
}

export const sortData = (data: any, param: string) => {
  const sortData = data.sort((data1:any,data2: any) => {
    if(typeof(data1[param]) === "string") {
      return data1[param]?.localeCompare(data2[param]);

    } else if(typeof(data1[param] instanceof Date)) {
      return data1[param]-data2[param];
    }
 });
 return sortData;
}

 export const filterData = (data: any,filterParam: string , filterParamValue: any, equal:boolean = true ) => {
   return data?.filter((data: any) => equal ? data[filterParam] === filterParamValue : data[filterParam] !== filterParamValue);
 }

 export const parseData = (data: any) => {
  try {
    return JSON.parse(data);
  } catch(err) {
    return null;
  }
 }

 export const checkIfTaskAvailable = (data: any, param: any,paramValue: any) => {
  return data?.some((data: any) => data[param] === paramValue)
 }

 export const setResponse = (res: Response, status: number, key: string, value: any) => {
    return res.status(status).json({[key]: value});
 }

 export const findIndexHelper = (data: Array<any>, param: string, paramValue: any) => {
  return data?.findIndex((data: any) => data[param] === paramValue)
 }

 export const isValidParams = (requestBody: any) => {
  
  const today = new Date().toISOString().slice(0, 10); 
    const taskSchema = Joi.object({
      title: Joi.string().min(3).max(255),
      description: Joi.string().allow(null, ''), // Optional description
      priority: Joi.string().valid(AppConstants.PRIORITY_LOW,AppConstants.PRIORITY_MEDIUM,AppConstants.PRIORITY_HIGH),
      dueDate: Joi.date().min(today),
      taskComments: Joi.array()
    });

    // Validate the request body
    const { error } = taskSchema.validate(requestBody);

    return error ? error : null;
 }


 