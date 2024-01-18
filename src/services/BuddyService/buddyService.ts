import {Request, Response} from 'express';
import { fileData } from '../../models/fileData';
const helperUtil = require('../../utils/helper');

const fs = require('fs');
const { appConstants } = require('../../constants/appConstants');
const logger = require('../../logger');

export default class buddyService {

    public async getBuddiesDetails(req: Request, res: Response) {
        try {
            const filePath: string = appConstants.FILE_PATH;
            fs.readFile(filePath, (err: Error, data: any) => {
                if (err) {
                    logger.error(appConstants.FILE_ERROR);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.write(appConstants.INTERNAL_SERVER_ERROR);
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.write(data);
                    res.end();
                }
            });
        } catch (error) {
            logger.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(error);
            res.end();
        }
    }

    public async getBuddyDetails(req: Request, res: Response) {
        try {
            const buddyId: number = parseInt(req?.params?.id, 10);
            const filePath = appConstants?.FILE_PATH;
            fs.readFile(filePath, (err: Error, data: any) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.write(appConstants.INTERNAL_SERVER_ERROR);
                    res.end();
                } else {
                    const fileData: Array<fileData> = JSON.parse(data);
                    for( let buddyData of fileData) {
                        if(buddyData?.employeeId === buddyId) {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.write(JSON.stringify(buddyData));
                            res.end(); 
                            return;
                        }  
                    }
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.write(appConstants?.NO_DATA_FOUND);
                    res.end();
                }
            });
        } catch (error) {
            logger.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(error);
            res.end();
        }
    }

    public async addBuddyDetails(req: Request, res: Response) {
        let isValidRequest = true;
        for(let key of appConstants.BUDDY_KEYS) {
            (req?.body[key] === undefined) && (isValidRequest = false);
        }
        !helperUtil.isValidDate(req?.body[appConstants?.DOB]) && (isValidRequest = false);
        try {
            if(isValidRequest) {
                const filePath = appConstants?.FILE_PATH;
                fs.readFile(filePath, (err: any, data: any) => {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.write(appConstants?.INTERNAL_SERVER_ERROR);
                        res.end();
                    } else {
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
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.write(err);
                                res.end();
                                return;
                            }
                            logger.info(appConstants.ADDED_SUCCESSFULLY);
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.write(JSON.stringify({message: appConstants.ADDED_SUCCESSFULLY}));
                            res.end();
                        });
                    }
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.write(appConstants?.BAD_REQUEST);
                res.end();
            }
            
        } catch (error) {
            logger.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(error)
            res.end();
        }
    }

    public async updateBuddyDetails(req: Request, res: Response) {
        let isValidRequest = true;
        const updatedData: any = {
            employeeId : req?.body?.employeeId,
            realName :req?.body?.realName,
            nickName :req?.body?.nickName,
            dob :req?.body?.dob,
            hobbies :req?.body?.hobbies,
        }

        if(updatedData?.dob && !helperUtil.isValidDate(req?.body[appConstants?.DOB])) {
            isValidRequest = false;
        }

        const buddyKeys = appConstants?.BUDDY_KEYS;
        try {
            if(isValidRequest) {
                const filePath = appConstants?.FILE_PATH;
                fs.readFile(filePath, (err: any, data: any) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.write(appConstants?.INTERNAL_SERVER_ERROR);
                        res.end(); 
                    } else {
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
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.write(err);
                                res.end();
                            }
                            logger.info(appConstants.UPDATED_SUCCESSFULLY);
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.write(JSON.stringify({message: appConstants.UPDATED_SUCCESSFULLY}));
                            res.end();
                        });
                    }
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.write(appConstants?.BAD_REQUEST);
                res.end();
            }
            
        } catch (error) {
            logger.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(error);
            res.end();
        }
    }

}