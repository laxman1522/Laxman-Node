import { readFileSync } from "fs";
import { userData } from "../../interface/userInterface";
import { User } from "../../models/user/user";
import { hashPassword, verifypassword } from "../../utils/helper";
import { readFile } from "../fileService/fileService";
import logger from "../../logger/logger";
import { APP_CONSTANTS } from "../../constants/appContants";

const UserService = () => {

    /**
     * Responsible for validating and registering the user 
     * @param userData 
     * @returns 
     */
    const createUser = async (userData: userData) => {
        try {
            const hashedPassword = hashPassword(userData?.password);
            let user;
            const cdwWalletUsers = await readFile(APP_CONSTANTS.FILE_PATH.USER_ROLES);
            for(let walletUser of cdwWalletUsers) {
                    if(walletUser?.email === userData.email) {
                        user = new User({ ...userData, password: hashedPassword, role: walletUser?.role, approvedUser: walletUser?.role === APP_CONSTANTS.ROLES.ADMIN }); 
                    }
            }
            user = user ? user : new User({ ...userData, password: hashedPassword, role: APP_CONSTANTS.ROLES.COWORKER, approvedUser: false });
            await user.save();
            return null;
        } catch(err: any) {
            const error: any = new Error(APP_CONSTANTS.ERROR.USER_ALREADY_EXISTS);
            error.statusCode = 409;
            throw error;
        } 
    }

    const loginUser = async (email: string, password: string) => {
        const userData = await User.findOne({email: email });
        const isPasswordMatching = await verifypassword(userData?.password!, password);
        console.log(isPasswordMatching);
        return userData;
    }

    /**
     * Responsible for checking whether the registered user is already present in the DB
     * @param userData 
     * @returns 
     */
    const isUserExist = async (userData: userData) => {
        const userList = await User.find({$or: [{email:userData?.email},{employeeId: userData?.employeeId}]});
        return !!userList?.length;
    }

    return{createUser, loginUser, isUserExist};

}

export default UserService;