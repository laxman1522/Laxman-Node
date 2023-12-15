"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const { appConstants } = require('../constants/appConstants');
const logger = require('../logger');
class fileCreationService {
    fileCreation(fileName, fileContent) {
        fs.access(appConstants.FILE_PATH, fs.constants.F_OK, (err) => {
            if (err) {
                fs.writeFile(fileName, JSON.stringify(fileContent), (err) => {
                    logger.info(err ? err : appConstants.FILE_CREATED);
                });
            }
            else {
                logger.info(appConstants.FILE_EXIST);
            }
        });
    }
}
exports.default = fileCreationService;
