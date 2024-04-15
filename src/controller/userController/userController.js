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
const userService = (0, userService_1.default)();
const UserController = () => {
    const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info(appConstants_1.AppConstants.CREATE_USER.CONTROLLER);
        yield userService.createUser(req, res);
    });
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield userService.login(req, res);
    });
    /**
     * Controller responsible for verifying the access token
     * @param req
     * @param res
     * @param next
     */
    const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield userService.verifyToken(req, res, next);
    });
    return { createUser, login, verifyToken };
};
exports.default = UserController;
