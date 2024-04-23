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
const userService_1 = __importDefault(require("../../services/userService/userService"));
const appConstants_1 = require("../../constants/appConstants/appConstants");
const logger_1 = __importDefault(require("../../logger/logger"));
const helper_1 = require("../../utils/helper");
const userService = (0, userService_1.default)();
const UserController = () => {
    /**
     * Controller method responsible for creating a user
     * @param req
     * @param res
     */
    const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        logger_1.default.info(appConstants_1.AppConstants.CREATE_USER.CONTROLLER);
        try {
            const userName = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username;
            const password = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password;
            if (userName && password) {
                const accessToken = yield userService.createUser(userName, password);
                const data = {
                    accessToken: accessToken
                };
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.CREATED, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.SIGNUP_SUCCESS, data);
            }
            else {
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.BAD_REQUEST, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, {});
            }
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.USER_ALREADY_EXIST) {
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.USER_ALREADY_EXIST, {});
            }
            else {
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    });
    /**
     * Controller method responsible for logging in the user with valid credentials
     * @param req
     * @param res
     */
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        logger_1.default.info(appConstants_1.AppConstants.LOGIN.CONTROLLER);
        try {
            const userName = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.username;
            const password = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.password;
            if (userName && password) {
                const accessToken = yield userService.login(userName, password);
                const data = {
                    accessToken: accessToken
                };
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.LOGIN_SUCCESS, data);
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.BAD_REQUEST, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, {});
            }
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.USER_NOT_FOUND) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.USER_NOT_FOUND, {});
            }
            else if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.INVALID_CREDENTIALS) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.UNAUTHORIZED, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.USER_NOT_AUTHORIZED, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, true, false, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    });
    /**
     * Controller responsible for verifying the access token
     * @param req
     * @param res
     * @param next
     */
    const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers[appConstants_1.AppConstants === null || appConstants_1.AppConstants === void 0 ? void 0 : appConstants_1.AppConstants.AUTHORIZATION];
            const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
            if (token) {
                const userName = yield userService.verifyToken(token);
                req.user = userName;
                next();
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.FORBIDDEN, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN, {});
            }
        }
        catch (error) {
            if (error === appConstants_1.AppConstants.UNAUTHORIZED) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.UNAUTHORIZED, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.USER_NOT_AUTHORIZED, {});
            }
            else if (error === appConstants_1.AppConstants.INVALID_TOKEN) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.FORBIDDEN, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    });
    return { createUser, login, verifyToken };
};
exports.default = UserController;
