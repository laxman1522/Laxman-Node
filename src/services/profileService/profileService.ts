
import { PROFILE_INFO_FIELDS, APP_CONSTANTS} from "../../constants/appContants"
import { userData } from "../../interface/userInterface";
import { User } from "../../models/user/user";


const ProfileService = () => {

    /**
     * 
     * @param email 
     * @returns 
     */
    const fetchProfile = async (email: string) => {
        try {
            const profileInfo: Array<userData> | null = await User.find({approvalStatus: APP_CONSTANTS.APPROVAL_STATUS.APPROVED}).lean().select(PROFILE_INFO_FIELDS.join(' '));;
            return profileInfo;

        } catch (err) {
            const error : any =  new Error(APP_CONSTANTS.ERROR.ERROR_FETCHING_PROFILE_INFO);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR; 
            throw error;
        }
    }

    /**
     * 
     * @param email 
     * @param userData 
     */
    const updateProfile = async (email: string,userData: userData) => {
        try {
            // Ensure only fields that need updating are set
            const updateFields = { $set: userData };
            const updatedUserProfile = await User.findOneAndUpdate({email: email}, updateFields, {new: true});
            return updatedUserProfile;
        } catch(err) {
            const error: any =  new Error(APP_CONSTANTS.ERROR.PROFILE_UPDATION_FAILED);
            error.statusCode = 500;
            throw error;
        }
    }


    return {fetchProfile, updateProfile}
}

export default ProfileService;