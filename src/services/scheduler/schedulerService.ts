import { readFile, writeFile } from '../fileService/fileService';
import { APP_CONSTANTS } from "../../constants/appContants";
import { User } from '../../models/user/user';
import logger from '../../logger/logger';


const SchedulerService = {

    /**
     * Scheduler logic for removing the employee details who had left the organisation
     */
    removeInactiveEmployee : async () => {

        try {

            logger.info(APP_CONSTANTS.SCHEDULER_STARTED);

            let cdwMockJson = await readFile(APP_CONSTANTS.FILE_PATH.CDW_WALLET_USERS);
        
            let existingUserList = cdwMockJson?.map((user: any) => {
                return user?.employeeId;
            })
        
            await User.deleteMany({employeeId: {$nin: existingUserList}}); 
             
             logger.info(APP_CONSTANTS.SUCCESS.SCHEDULER_UPDATE + " " + existingUserList?.map((user: number) => user));
        }
        catch(err: any) {
            logger.error()
        }
    }

}


export default SchedulerService;