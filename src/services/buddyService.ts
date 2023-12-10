import {Request, Response} from 'express';
import commonService from './commonService'
const fs = require('fs');
const { appConstants } = require('../constants/appConstants');


export default class buddyService {

    public async getBuddiesDetails(req: Request, res: Response) {
        try {
            const filePath = appConstants.FILE_PATH;
            fs.readFile(filePath, (err: any, data: any) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                }
            });
        } catch (error) {
            res.end(error);
        }
    }

    public async getBuddyDetails(req: Request, res: Response) {
        try {
            const buddyId = parseInt(req?.params?.id, 10);
            const filePath = appConstants?.FILE_PATH;
            fs.readFile(filePath, (err: any, data: any) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    const fileData = JSON.parse(data);
                    for( let buddyData of fileData) {
                        buddyData?.employeeId === buddyId && res.end(JSON.stringify(buddyData)); 
                    }

                    res.end(appConstants?.NO_DATA_FOUND);
                }
            });
        } catch (error) {
            res.end(error);
        }
    }

    public async addBuddyDetails(req: Request, res: Response) {
        let isValidRequest = true;
        for(let key of appConstants.BUDDY_KEYS) {
            (req?.body[key] === undefined) && (isValidRequest = false);
        }
        const common = new commonService();
        !common.isDateValid(req?.body[appConstants?.DOB]) && (isValidRequest = false);
        try {
            if(isValidRequest) {
                const filePath = appConstants?.FILE_PATH;
                fs.readFile(filePath, (err: any, data: any) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(appConstants?.INTERNAL_SERVER_ERROR);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        const existingBuddiesData = JSON.parse(data);
                        existingBuddiesData.push({
                            employeeId: req?.body?.employeeId,
                            realName: req?.body?.realName,
                            nickName: req?.body?.nickName,
                            dob: req?.body?.dob,
                            hobbies: req?.body?.hobbies
                        })

                    const updatedBuddiesData = JSON.stringify(existingBuddiesData);

                    fs.writeFile(filePath, updatedBuddiesData, 'utf8', (err: any) => {
                        if (err) {
                            res.end(err);
                            return;
                        }

                        res.end(updatedBuddiesData);
                    });
                    }
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(appConstants?.BAD_REQUEST);
            }
            
        } catch (error) {
            res.end(error);
        }
    }

    public async updateBuddyDetails(req: Request, res: Response) {
        const updatedData: any = {
            employeeId : req?.body?.employeeId,
            realName :req?.body?.realName,
            nickName :req?.body?.nickName,
            dob :req?.body?.dob,
            hobbies :req?.body?.hobbies,
        }

        const buddyKeys = appConstants?.BUDDY_KEYS;
        try {
            const filePath = appConstants?.FILE_PATH;
            fs.readFile(filePath, (err: any, data: any) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(appConstants?.INTERNAL_SERVER_ERROR);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    const existingBuddiesData = JSON.parse(data);
                    for(let buddyData of existingBuddiesData) {
                        if(buddyData?.employeeId === updatedData?.employeeId) {
                            for(let key of buddyKeys) {
                                updatedData[key] && (buddyData[key] = updatedData[key]);
                            } 
                        }
                    }

                   const updatedBuddiesData = JSON.stringify(existingBuddiesData);

                   fs.writeFile(filePath, updatedBuddiesData, 'utf8', (err: any) => {
                    if (err) {
                        res.end(err);
                      return;
                    }

                    res.end(updatedBuddiesData);
                  });
                }
            });
        } catch (error) {
            res.end(error);
        }
    }

}