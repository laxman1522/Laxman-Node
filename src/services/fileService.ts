const fs = require('fs');
const { appConstants } = require('../constants/appConstants');

export default class fileCreationService {
    public fileCreation(fileName: string, fileContent: any) {
        fs.access(appConstants.FILE_PATH, fs.constants.F_OK, (err: any) => {
            if(err) {
                fs.writeFile(fileName, JSON.stringify(fileContent), (err: any) => {
                    console.log(err ? err : "file created successfully") 
                })
            } else {
                console.log('file alreday exist')
            }
        })
    }
}