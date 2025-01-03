import { userData } from "../../interface/userInterface";
import { User } from "../../models/user/user";
import { hashPassword, verifypassword } from "../../utils/helper";
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
    const createUser = async (userData: userData, updateUser: boolean) => {

        //logger
        logger.info(APP_CONSTANTS?.USER_SERVICE?.CREATE_USER?.START);

        try {
            const hashedPassword = await hashPassword(userData?.password);
            let user;
            let role = APP_CONSTANTS.ROLES.COWORKER;
            const cdwWalletUsers = await readFile(APP_CONSTANTS.FILE_PATH.USER_ROLES);
            for(let walletUser of cdwWalletUsers) {
                    if(walletUser?.email === userData.email) {
                        role = walletUser?.role;
                        user = new User({ ...userData, password: hashedPassword, role: walletUser?.role, approvalStatus: walletUser?.role === APP_CONSTANTS.ROLES.ADMIN ?  APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.PENDING }); 
                    }
            }
            
            if(updateUser) {
                await User.findOneAndUpdate({email: userData?.email},{ $set: {
                    ...userData,
                    password: hashedPassword,
                    role: role,
                    approvalStatus: role === APP_CONSTANTS.ROLES.ADMIN ?  APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.PENDING
                } },{ new: true, upsert: false });
            } else {
                user = new User({ ...userData, password: hashedPassword, role: role, approvalStatus: role === APP_CONSTANTS.ROLES.ADMIN ?  APP_CONSTANTS.APPROVAL_STATUS.APPROVED : APP_CONSTANTS.APPROVAL_STATUS.PENDING});
                await user.save();
            }

            //logger
            logger.info(APP_CONSTANTS?.USER_SERVICE?.CREATE_USER?.ENDED); 

            return user?.role === APP_CONSTANTS.ROLES.ADMIN;
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
     * @param email 
     * @param password 
     * @returns 
     */
    const loginUser = async (email: string, password: string) => {
        logger.info(APP_CONSTANTS.USER_SERVICE.LOGIN_USER.START);
        const userData = await User.findOne({email: email });

        if(userData) {
            const isPasswordMatching = await verifypassword(userData?.password!, password);

            if(isPasswordMatching) {
                const user = {email: email};
                const accessToken = await generateAccessToken(user, APP_CONSTANTS.TOKEN_EXPIRATION);
                logger.info(APP_CONSTANTS.USER_SERVICE.LOGIN_USER.ENDED);
                return {accessToken: accessToken};
            } else {
                logger.info(APP_CONSTANTS.USER_SERVICE.LOGIN_USER.ERROR);
                const error: any = new Error(APP_CONSTANTS.ERROR.INVALID_PASSWORD);
                error.statusCode = APP_CONSTANTS.STATUS_CODES.UNAUTHORIZED;
                throw error;
            }
        } else {
                logger.info(APP_CONSTANTS.USER_SERVICE.LOGIN_USER.ERROR);
                const error: any = new Error(APP_CONSTANTS.ERROR.INVALID_USER);
                error.statusCode = APP_CONSTANTS.STATUS_CODES.UNAUTHORIZED;
                throw error;
        }
        
    }

    /**
     * Responsible for fetching the existing user details
     * @param email 
     * @param employeeId 
     * @returns 
     */
    const existingUser = async(email: string, employeeId: number = 0) => {
        try {
            const userDetails: userData | null = await User.findOne({$or: [{email:email},{employeeId: employeeId}]});
            return userDetails;
        } catch(err) {

        }
    }

    /**
     * Responsible for checking whether the registered user is already present in the DB
     * @param userData 
     * @returns 
     */
    const isUserExist = async (email: string, employeeId: number = 0) => {
        const userList = await User.find({$or: [{email:email},{employeeId: employeeId}]});
        return !!userList?.length;
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
    const approveUser = async (email: string) => {
        let user;
        try {
            const cdwWalletUsers = await readFile(APP_CONSTANTS.FILE_PATH.USER_ROLES);
            for(let walletUser of cdwWalletUsers) {
                        if(walletUser?.email === email) {
                            sendEmail(APP_CONSTANTS.MOCK_EMAIL, email, APP_CONSTANTS.CDW_CONNECT_APPROVAL_STATUS, APP_CONSTANTS.APPROVAL_STATUS.APPROVED, APP_CONSTANTS.APPROVAL_STATUS.APPROVED);
                            user = await User.updateOne({email: email },{$set:{approvalStatus:APP_CONSTANTS.APPROVAL_STATUS.APPROVED}});
                            return true;
                        }
            }
            if(!user) {
                sendEmail(APP_CONSTANTS.MOCK_EMAIL, email, APP_CONSTANTS.CDW_CONNECT_APPROVAL_STATUS, APP_CONSTANTS.APPROVAL_STATUS.REJECTED, APP_CONSTANTS.APPROVAL_STATUS.REJECTED);
                user = await User.updateOne({email: email },{$set:{approvalStatus:APP_CONSTANTS.APPROVAL_STATUS.REJECTED}});
                return false;
            }

        } catch(err) {
            const error: any =  new Error(APP_CONSTANTS.ERROR.APPROVAL_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    }


    return{createUser, loginUser, isUserExist, verifyToken, fetchPendingUser, approveUser, getUpdatedTime, existingUser};

}

export default UserService;