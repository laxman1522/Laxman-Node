import { userData } from "../../interface/userInterface";
import { User } from "../../models/user/user";
import { hashPassword } from "../../utils/helper";
import { readFile } from "../fileService/fileService";
import logger from "../../logger/logger";
import { APP_CONSTANTS } from "../../constants/appContants";
import { user } from "../../interface/userData";
import { sendEmail } from "../../utils/nodemailer";
const jwt = require("jsonWebToken");

const UserService = () => {

    /**
     * Responsible for validating and registering the user 
     * @param userData 
     * @returns 
     */
    const createUser = async (userData: userData, isAdmin: boolean) => {

        //logger
        logger.info(APP_CONSTANTS?.USER_SERVICE?.CREATE_USER?.START);

        try {
            const hashedPassword = await hashPassword(userData?.password);

            const user = new User({ ...userData, password: hashedPassword, role: isAdmin ? APP_CONSTANTS.ROLES.ADMIN : APP_CONSTANTS.ROLES.COWORKER, approvalStatus: isAdmin ?  APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.PENDING});
            await user.save();

            //logger
            logger.info(APP_CONSTANTS?.USER_SERVICE?.CREATE_USER?.ENDED);

            return true;
        } catch(err: any) {
            //logger
            logger.info(APP_CONSTANTS?.USER_SERVICE?.CREATE_USER?.ERROR, err?.message);

            const error: any = new Error(APP_CONSTANTS.ERROR.SAVE_USER_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        } 
    }

    /**
     * 
     * @param userData 
     * @param isAdmin 
     */
    const updateUser = async (userData: userData, isAdmin: boolean) => {

        try {
            const hashedPassword = await hashPassword(userData?.password);

            await User.findOneAndUpdate({email: userData?.email},{ $set: {
                ...userData,
                password: hashedPassword,
                role: isAdmin ? APP_CONSTANTS.ROLES.ADMIN : APP_CONSTANTS.ROLES.COWORKER,
                approvalStatus: isAdmin ?  APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.PENDING
            } },{ new: true, upsert: false });

        } catch (err: any) {

            //logger
            logger.info(APP_CONSTANTS?.USER_SERVICE?.CREATE_USER?.ERROR, err?.message);

            const error: any = new Error(APP_CONSTANTS.ERROR.SAVE_USER_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
        
    }

    /**
     * Checks whether the user is admin or not
     * @param email 
     * @returns 
     */
    const getCdwWalletUserData = async (email: string, employeeId: number) => {

        try {
            let isAdmin = false;
            let isValidUser = false;

            const cdwWalletUsers = await readFile(APP_CONSTANTS.FILE_PATH.CDW_WALLET_USERS);

            cdwWalletUsers?.forEach((user: any) => {
                if(user?.email === email) {
                    if(user?.employeeId === employeeId) {
                        isAdmin = user?.role === APP_CONSTANTS.ROLES.ADMIN ? true : false;
                        isValidUser = true;
                    }
                }
            })

            return {isAdmin: isAdmin, isValidUser: isValidUser };
        } catch(err: any) {
            logger.error(err?.message);
            const error: any = err?.message;
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }

        
    } 

    /**
     * 
     * @param email 
     * @param password 
     * @returns 
     */
    const loginUser = async (email: string) => {

        try {
            logger.info(APP_CONSTANTS.USER_SERVICE.LOGIN_USER.START);
           
            const user = {email: email};
            const accessToken = await generateAccessToken(user, APP_CONSTANTS.TOKEN_EXPIRATION);

            logger.info(APP_CONSTANTS.USER_SERVICE.LOGIN_USER.ENDED);
            return {accessToken: accessToken};

        } catch(err: any) {
            logger.error(err?.message);
            const error: any = new Error(err?.message);
            error.statusCode = err?.statusCode ? err?.statusCode : APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
        
        
    }

    /**
     * Responsible for fetching the existing user details
     * @param email 
     * @param employeeId 
     * @returns 
     */
    const getExistingUser = async(email: string, employeeId: number = 0) => {
        try {
            const userDetails: userData | null = await User.findOne({$or: [{email:email},{employeeId: employeeId}]});
            return userDetails;
        } catch(err: any) {
            logger.error(err?.message);
            const error: any = err?.message;
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
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
            throw new Error(APP_CONSTANTS.UNAUTHORIZED);
        }
        try {
            const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return decoded;
        } catch (err: any) {
            const error: any = new Error(APP_CONSTANTS.INVALID_TOKEN);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.UNAUTHORIZED;
            throw error; // Handle specific JWT errors
        }
    };

     /**
     * Method for generating the access token
     * @param data 
     * @param expiresIn 
     * @returns 
     */
     const generateAccessToken = async (userData: user, expiresIn: string) => {
        const accessToken = await jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET,{expiresIn: expiresIn});
        return accessToken;
    }

    /**
     * 
     * @returns userlist
     */
    const fetchPendingUser = async () => {
        const users = await User.find({ approvalStatus: APP_CONSTANTS.APPROVAL_STATUS.PENDING });
        return users;
    }

    /**
     * 
     * @param email 
     * @returns 
     */
    const getUpdatedTime = async (email: string) => {
        const user: any = await User.findOne({email: email}).select('updatedAt');
        return user?.updatedAt;
    }

    /**
     * 
     * @param email 
     * @returns 
     */
    const approveUser = async (email: string, employeeId: number) => {

        let isValidUser = false;

        try {
            const cdwWalletUsers = await readFile(APP_CONSTANTS.FILE_PATH.CDW_WALLET_USERS);

            for(let walletUser of cdwWalletUsers) {
                if(walletUser?.email === email && walletUser?.employeeId === employeeId) {
                        isValidUser = true; 
                        break; 
                }
            }

            sendEmail(APP_CONSTANTS.MOCK_EMAIL, APP_CONSTANTS.MOCK_EMAIL, APP_CONSTANTS.CDW_CONNECT_APPROVAL_STATUS,isValidUser ? APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.REJECTED, 
                    isValidUser ? APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.REJECTED);

            
            await User.updateOne({email: email },{$set:{approvalStatus: isValidUser ? APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.REJECTED}})
            return isValidUser;

        } catch(err) {
            const error: any =  new Error(APP_CONSTANTS.ERROR.APPROVAL_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    }


    return{createUser, loginUser, verifyToken, fetchPendingUser, approveUser, getUpdatedTime, getExistingUser, getCdwWalletUserData, updateUser};

}

export default UserService;