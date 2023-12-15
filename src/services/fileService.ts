const fs = require('fs');
const { appConstants } = require('../constants/appConstants');
const logger = require('../logger');

export default class fileCreationService {
    public fileCreation(fileName: string, fileContent: any) {
        fs.access(appConstants.FILE_PATH, fs.constants.F_OK, (err: any) => {
            if(err) {
                fs.writeFile(fileName, JSON.stringify(fileContent), (err: any) => {
                    logger.info(err ? err : appConstants.FILE_CREATED) 
                })
            } else {
                logger.info(appConstants.FILE_EXIST);
            }
        })
    }
}