"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const { appConstants } = require('../constants/appConstants');
class fileCreationService {
    fileCreation(fileName, fileContent) {
        fs.access(appConstants.FILE_PATH, fs.constants.F_OK, (err) => {
            if (err) {
                fs.writeFile(fileName, JSON.stringify(fileContent), (err) => {
                    console.log(err ? err : "file created successfully");
                });
            }
            else {
                console.log('file alreday exist');
            }
        });
    }
}
exports.default = fileCreationService;
