import bcrypt from "bcrypt";
const jwt = require("jsonWebToken");
import { Request, Response } from "express";
import { readFile,writeFile } from "../fileService/fileService";
import {AppConstants} from "../../constants/appConstants/appConstants";
import { getExistingUserData, parseData, setResponse } from "../../utils/helper";
import logger from "../../logger/logger";

const UserService = () => {

    const createUser = async (req: Request,res: Response) => {
        logger.info(AppConstants.CREATE_USER.SERVICE)
        try {
            const userName = req?.body?.username;
            const password = req?.body?.password;

            if(userName && password) {
                const saltRounds = await bcrypt.genSalt(); // Adjust as needed for security
                const Password = await bcrypt.hash(password, saltRounds);

                let users: any = readFile(AppConstants.USER_FILE_NAME);

                users = parseData(users);

                // Check if username already exists
                const existingUser = getExistingUserData(userName, users, AppConstants.USERNAME);

                if(!existingUser) {
                    // Add new user to the list
                    users.push({ userName, password: Password });

                    // Update the JSON file with the new user list
                    writeFile(AppConstants.USER_FILE_NAME,users);
                    const user = {name: userName};
                    const accessToken = generateAccessToken(user, "30m");
                    return setResponse(res,201,AppConstants.ACCESS_TOKEN,accessToken)
                } else {
                    return setResponse(res,400,AppConstants.ERROR,AppConstants.USER_ALREADY_EXIST);
                }
            } else {

            }
        } catch (err) {
            logger.error(AppConstants.CREATE_USER.ERROR);
            return setResponse(res,404,AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
        }
    }

    const generateAccessToken = (data: any, expiresIn: string) => {
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET,{expiresIn: expiresIn});
        return accessToken;
    }

    const login = async (req: Request,res: Response) => {
        const userName = req?.body?.username;
        const password = req?.body?.password;

        if(userName && password) {
            let users: any = readFile(AppConstants.USER_FILE_NAME);
            users = parseData(users);
    
            // Check if username already exists
            const existingUser = getExistingUserData(userName, users,AppConstants.USERNAME);

            if(existingUser) {
                const isValidPassword = await bcrypt.compare(password, existingUser?.password);
                if(isValidPassword) {
                    const user = {name: userName};
                    const accessToken = generateAccessToken(user, AppConstants.TOKEN_EXPIRATION);
                    return res.json({accessToken: accessToken});
                } else {
                    return setResponse(res,400,AppConstants.ERROR,AppConstants.INVALID_CREDENTIALS);
                }
            } else {
               return setResponse(res,404,AppConstants.ERROR,AppConstants.USER_NOT_FOUND)
            }
        } else {
            return setResponse(res,400,AppConstants.ERROR,AppConstants.INVALID_PARAMS);
        }
    }

    /**
     * Method responsible for handling the logic to verify the token 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    const verifyToken = (req: any, res: any, next: any) => {
        try {
            const authHeader: any = req.headers[AppConstants?.AUTHORIZATION];
            const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
          
            if (!token) {
                return setResponse(res,401,AppConstants.ERROR,AppConstants.UNAUTHORIZED);
            }
          
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any, decoded: any) => {
              if (err) {
                return setResponse(res,403,AppConstants.ERROR,AppConstants.INVALID_TOKEN);
              }
              req.user = decoded; // Attach decoded user data to request
              next();
            });
        } catch(err) {
            return setResponse(res,500,AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
        }
    };

    return {createUser, login, verifyToken};
}

export default UserService;