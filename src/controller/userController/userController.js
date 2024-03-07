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
const jwt = require("jsonWebToken");
const dotenv = require("dotenv");
const userService = (0, userService_1.default)();
const UserController = () => {
    const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            userService.createUser(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server Error");
        }
    });
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            userService.login(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server Error");
        }
    });
    const verifyToken = (req, res, next) => {
        try {
            userService.verifyToken(req, res, next);
        }
        catch (err) {
            res.status(500).json("Internal Server Error");
        }
    };
    return { createUser, login, verifyToken };
};
exports.default = UserController;
