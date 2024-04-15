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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = require("jsonWebToken");
const fileService_1 = require("../fileService/fileService");
const appConstants_1 = require("../../constants/appConstants/appConstants");
const helper_1 = require("../../utils/helper");
const logger_1 = __importDefault(require("../../logger/logger"));
const UserService = () => {
    const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        logger_1.default.info(appConstants_1.AppConstants.CREATE_USER.SERVICE);
        try {
            const userName = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username;
            const password = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password;
            if (userName && password) {
                const saltRounds = yield bcrypt_1.default.genSalt(); // Adjust as needed for security
                const Password = yield bcrypt_1.default.hash(password, saltRounds);
                let users = (0, fileService_1.readFile)(appConstants_1.AppConstants.USER_FILE_NAME);
                users = (0, helper_1.parseData)(users);
                // Check if username already exists
                const existingUser = (0, helper_1.getExistingUserData)(userName, users, appConstants_1.AppConstants.USERNAME);
                if (!existingUser) {
                    // Add new user to the list
                    users.push({ userName, password: Password });
                    // Update the JSON file with the new user list
                    (0, fileService_1.writeFile)(appConstants_1.AppConstants.USER_FILE_NAME, users);
                    const user = { name: userName };
                    const accessToken = generateAccessToken(user, "30m");
                    return (0, helper_1.setResponse)(res, 200, appConstants_1.AppConstants.ACCESS_TOKEN, accessToken);
                }
                else {
                    return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.USER_ALREADY_EXIST);
                }
            }
            else {
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.CREATE_USER.ERROR);
            return (0, helper_1.setResponse)(res, 404, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INTERNAL_SERVER_ERROR);
        }
    });
    const generateAccessToken = (data, expiresIn) => {
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
        return accessToken;
    };
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        const userName = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.username;
        const password = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.password;
        if (userName && password) {
            let users = (0, fileService_1.readFile)(appConstants_1.AppConstants.USER_FILE_NAME);
            users = (0, helper_1.parseData)(users);
            // Check if username already exists
            const existingUser = (0, helper_1.getExistingUserData)(userName, users, appConstants_1.AppConstants.USERNAME);
            if (existingUser) {
                bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password, (err) => {
                    if (err) {
                        return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INVALID_CREDENTIALS);
                    }
                    else {
                        const user = { name: userName };
                        const accessToken = generateAccessToken(user, appConstants_1.AppConstants.TOKEN_EXPIRATION);
                        return res.json({ accessToken: accessToken });
                    }
                });
            }
            else {
                return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.USER_NOT_FOUND);
            }
        }
        else {
            return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INVALID_PARAMS);
        }
    });
    /**
     * Method responsible for handling the logic to verify the token
     * @param req
     * @param res
     * @param next
     * @returns
     */
    const verifyToken = (req, res, next) => {
        try {
            const authHeader = req.headers[appConstants_1.AppConstants === null || appConstants_1.AppConstants === void 0 ? void 0 : appConstants_1.AppConstants.AUTHORIZATION];
            const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
            if (!token) {
                return (0, helper_1.setResponse)(res, 401, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.UNAUTHORIZED);
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return (0, helper_1.setResponse)(res, 403, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INVALID_TOKEN);
                }
                req.user = decoded; // Attach decoded user data to request
                next();
            });
        }
        catch (err) {
            return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INTERNAL_SERVER_ERROR);
        }
    };
    return { createUser, login, verifyToken };
};
exports.default = UserService;
