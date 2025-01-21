import { NextFunction, Response } from "express";
import logger from "../../logger/logger";
import { APP_CONSTANTS } from "../../constants/appContants";
import ProfileService from "../../services/profileService/profileService";
import { setResponse } from "../../utils/helper";


const ProfileController: any = () => {

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    const fetchProfile = async (req: any, res: Response, next: NextFunction) => {
        logger.info(APP_CONSTANTS.PROFILE_CONTROLLER.FETCH_PROFILES.START);

        try {
            const employeeId = Number(req?.params?.employeeId);
            const profileInfo = await ProfileService.fetchProfile(employeeId);

            if(profileInfo) {
                return setResponse(res,APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.PROFILE_INFO_FETCH , profileInfo);
            } else {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.NOT_FOUND, false, true, APP_CONSTANTS.ERROR.NO_PROFILE, []);
            }

        } catch(err) {
            next(err);
        }

    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    const updateProfile = async (req: any, res: Response, next: NextFunction) => {

        logger.info(APP_CONSTANTS.PROFILE_CONTROLLER.UPDATE_PROFILE.START);

        try {
            const updatedProfile = await ProfileService.updateProfile(req?.email, req?.body);
            logger.info(APP_CONSTANTS.PROFILE_CONTROLLER.UPDATE_PROFILE.ENDED);
            return setResponse(res,APP_CONSTANTS.STATUS_CODES.SUCCESS, true,false, APP_CONSTANTS.SUCCESS.PROFILE_INFO_UPDATED, updatedProfile);
        } catch(err) {
            logger.info(APP_CONSTANTS.PROFILE_CONTROLLER.UPDATE_PROFILE.ERROR);
            next(err);
        }
    }

    return {fetchProfile, updateProfile};

}

export default ProfileController;