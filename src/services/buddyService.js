"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonService_1 = __importDefault(require("./commonService"));
const fs = require('fs');
const { appConstants } = require('../constants/appConstants');
class buddyService {
    getBuddiesDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = appConstants.FILE_PATH;
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(data);
                    }
                });
            }
            catch (error) {
                res.end(error);
            }
        });
    }
    getBuddyDetails(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buddyId = parseInt((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id, 10);
                const filePath = appConstants === null || appConstants === void 0 ? void 0 : appConstants.FILE_PATH;
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        const fileData = JSON.parse(data);
                        for (let buddyData of fileData) {
                            (buddyData === null || buddyData === void 0 ? void 0 : buddyData.employeeId) === buddyId && res.end(JSON.stringify(buddyData));
                        }
                        res.end(appConstants === null || appConstants === void 0 ? void 0 : appConstants.NO_DATA_FOUND);
                    }
                });
            }
            catch (error) {
                res.end(error);
            }
        });
    }
    addBuddyDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValidRequest = true;
            for (let key of appConstants.BUDDY_KEYS) {
                ((req === null || req === void 0 ? void 0 : req.body[key]) === undefined) && (isValidRequest = false);
            }
            const common = new commonService_1.default();
            !common.isDateValid(req === null || req === void 0 ? void 0 : req.body[appConstants === null || appConstants === void 0 ? void 0 : appConstants.DOB]) && (isValidRequest = false);
            try {
                if (isValidRequest) {
                    const filePath = appConstants === null || appConstants === void 0 ? void 0 : appConstants.FILE_PATH;
                    fs.readFile(filePath, (err, data) => {
                        var _a, _b, _c, _d, _e;
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end(appConstants === null || appConstants === void 0 ? void 0 : appConstants.INTERNAL_SERVER_ERROR);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            const existingBuddiesData = JSON.parse(data);
                            existingBuddiesData.push({
                                employeeId: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.employeeId,
                                realName: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.realName,
                                nickName: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.nickName,
                                dob: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.dob,
                                hobbies: (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.hobbies
                            });
                            const updatedBuddiesData = JSON.stringify(existingBuddiesData);
                            fs.writeFile(filePath, updatedBuddiesData, 'utf8', (err) => {
                                if (err) {
                                    res.end(err);
                                    return;
                                }
                                res.end(updatedBuddiesData);
                            });
                        }
                    });
                }
                else {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(appConstants === null || appConstants === void 0 ? void 0 : appConstants.BAD_REQUEST);
                }
            }
            catch (error) {
                res.end(error);
            }
        });
    }
    updateBuddyDetails(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = {
                employeeId: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.employeeId,
                realName: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.realName,
                nickName: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.nickName,
                dob: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.dob,
                hobbies: (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.hobbies,
            };
            const buddyKeys = appConstants === null || appConstants === void 0 ? void 0 : appConstants.BUDDY_KEYS;
            try {
                const filePath = appConstants === null || appConstants === void 0 ? void 0 : appConstants.FILE_PATH;
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(appConstants === null || appConstants === void 0 ? void 0 : appConstants.INTERNAL_SERVER_ERROR);
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        const existingBuddiesData = JSON.parse(data);
                        for (let buddyData of existingBuddiesData) {
                            if ((buddyData === null || buddyData === void 0 ? void 0 : buddyData.employeeId) === (updatedData === null || updatedData === void 0 ? void 0 : updatedData.employeeId)) {
                                for (let key of buddyKeys) {
                                    updatedData[key] && (buddyData[key] = updatedData[key]);
                                }
                            }
                        }
                        const updatedBuddiesData = JSON.stringify(existingBuddiesData);
                        fs.writeFile(filePath, updatedBuddiesData, 'utf8', (err) => {
                            if (err) {
                                res.end(err);
                                return;
                            }
                            res.end(updatedBuddiesData);
                        });
                    }
                });
            }
            catch (error) {
                res.end(error);
            }
        });
    }
}
exports.default = buddyService;
