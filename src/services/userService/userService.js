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
    /**
     * Method for creating a new user with the given username and password
     * @param userName
     * @param password
     * @returns
     */
    const createUser = (userName, password) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info(appConstants_1.AppConstants.CREATE_USER.SERVICE);
        const saltRounds = yield bcrypt_1.default.genSalt(); // Adjust as needed for security
        const Password = yield bcrypt_1.default.hash(password, saltRounds);
        //Reading and parsing the user file
        let users = (0, fileService_1.readFile)(appConstants_1.AppConstants.USER_FILE_NAME);
        // Check if username already exists
        const existingUser = (0, helper_1.getExistingUserData)(userName, users, appConstants_1.AppConstants.USERNAME);
        if (!existingUser) {
            // Add new user to the list
            users.push({ userName, password: Password });
            // Update the JSON file with the new user list
            (0, fileService_1.writeFile)(appConstants_1.AppConstants.USER_FILE_NAME, users);
            const user = { name: userName };
            const accessToken = generateAccessToken(user, "30m");
            return accessToken;
        }
        else {
            throw new Error(appConstants_1.AppConstants.USER_ALREADY_EXIST);
        }
    });
    /**
     * Method for generating the access token
     * @param data
     * @param expiresIn
     * @returns
     */
    const generateAccessToken = (userData, expiresIn) => {
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
        return accessToken;
    };
    /**
     * Method for allowing the user to login with valid credentials
     * @param req
     * @param res
     * @returns
     */
    const login = (userName, password) => __awaiter(void 0, void 0, void 0, function* () {
        let users = (0, fileService_1.readFile)(appConstants_1.AppConstants.USER_FILE_NAME);
        // Check if username already exists
        const existingUser = (0, helper_1.getExistingUserData)(userName, users, appConstants_1.AppConstants.USERNAME);
        if (existingUser) {
            const isValidPassword = yield bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password);
            if (isValidPassword) {
                const user = { name: userName };
                const accessToken = generateAccessToken(user, appConstants_1.AppConstants.TOKEN_EXPIRATION);
                return accessToken;
            }
            else {
                throw new Error(appConstants_1.AppConstants.INVALID_CREDENTIALS);
            }
        }
        else {
            throw new Error(appConstants_1.AppConstants.USER_NOT_FOUND);
        }
    });
    /**
     * Method responsible for handling the logic to verify the token
     * @param req
     * @param res
     * @param next
     * @returns
     */
    const verifyToken = (token) => {
        if (!token) {
            throw new Error(appConstants_1.AppConstants.UNAUTHORIZED);
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                throw new Error(appConstants_1.AppConstants.INVALID_TOKEN);
            }
            return decoded;
        });
    };
    return { createUser, login, verifyToken };
};
exports.default = UserService;
