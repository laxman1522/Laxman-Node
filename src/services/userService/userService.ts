import bcrypt from "bcrypt";
const jwt = require("jsonWebToken");
import { Request, Response } from "express";
import { readFile,writeFile } from "../fileService/fileService";
import {AppConstants} from "../../constants/appConstants/appConstants";
import { getExistingUserData, parseData, setResponse } from "../../utils/helper";
import logger from "../../logger/logger";

type userData = {
    userName: string,
    password: string
}

type user = {
    name: string
}

const UserService = () => {

    /**
     * Method for creating a new user with the given username and password
     * @param userName 
     * @param password 
     * @returns 
     */
    const createUser = async (userName: string, password: string) => {
        logger.info(AppConstants.CREATE_USER.SERVICE)

        const saltRounds = await bcrypt.genSalt(); // Adjust as needed for security
        const Password = await bcrypt.hash(password, saltRounds);

        //Reading and parsing the user file
        let users: Array<userData> = readFile(AppConstants.USER_FILE_NAME);

        // Check if username already exists
        const existingUser = getExistingUserData(userName, users, AppConstants.USERNAME);

        if(!existingUser) {
            // Add new user to the list
            users.push({ userName, password: Password });
            // Update the JSON file with the new user list
            writeFile(AppConstants.USER_FILE_NAME,users);
            const user = {name: userName};
            const accessToken = generateAccessToken(user, "30m");
            return accessToken;
        } else {
            throw new Error(AppConstants.USER_ALREADY_EXIST);
        }
    }

    /**
     * Method for generating the access token
     * @param data 
     * @param expiresIn 
     * @returns 
     */
    const generateAccessToken = (userData: user, expiresIn: string) => {
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET,{expiresIn: expiresIn});
        return accessToken;
    }

    /**
     * Method for allowing the user to login with valid credentials
     * @param req 
     * @param res 
     * @returns 
     */
    const login = async (userName: string,password: string) => {

            let users: Array<userData> = readFile(AppConstants.USER_FILE_NAME);
    
            // Check if username already exists
            const existingUser = getExistingUserData(userName, users,AppConstants.USERNAME);

            if(existingUser) {
                const isValidPassword = await bcrypt.compare(password, existingUser?.password);
                if(isValidPassword) {
                    const user = {name: userName};
                    const accessToken = generateAccessToken(user, AppConstants.TOKEN_EXPIRATION);
                    return accessToken;
                } else {
                    throw new Error(AppConstants.INVALID_CREDENTIALS);
                }
            } else {
               throw new Error(AppConstants.USER_NOT_FOUND);
            }
    }

    /**
     * Method responsible for handling the logic to verify the token 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    const verifyToken = async (token : string) => {
          
            if (!token) {
                throw new Error(AppConstants.UNAUTHORIZED);
            }
            try {
                const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                return decoded;
            } catch (error: any) {
                throw new Error(AppConstants.INVALID_TOKEN); // Handle specific JWT errors
            }
    };

    return {createUser, login, verifyToken};
}

export default UserService;