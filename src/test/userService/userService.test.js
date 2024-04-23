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
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken'); // Assuming jwt is used for token verification
jest.mock("../../services/fileService/fileService", () => ({
    readFile: () => { return [{}]; },
    writeFile: () => { }
}));
jest.mock('jsonwebtoken'); // Mock the entire jwt module
jest.mock("../../utils/helper", () => ({
    getExistingUserData: () => { return { userName: "John", password: "test" }; },
}));
const { verifyToken, generateAccessToken, login, createUser } = (0, userService_1.default)();
jest.mock('bcrypt');
describe('User Service', () => {
    it('should throw an error for missing token', () => __awaiter(void 0, void 0, void 0, function* () {
        const emptyToken = "";
        try {
            yield verifyToken(emptyToken);
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.UNAUTHORIZED);
        }
    }));
    it('should throw an error for invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidToken = 'invalid.token';
        try {
            yield verifyToken(invalidToken);
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.INVALID_TOKEN);
        }
    }));
    it('should return decoded data for valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUserData = { username: 'user1' };
        jwt.verify.mockImplementationOnce((tokenToVerify, secret) => {
            if (tokenToVerify === "test" && secret === process.env.ACCESS_TOKEN_SECRET) {
                return mockUserData; // Return mock data for successful verification
            }
            throw new Error('invalid token'); // Throw error for any other token
        });
        const decoded = yield verifyToken("test");
        expect(decoded).toEqual(mockUserData);
    }));
    it('should test login function without valid creds ', () => __awaiter(void 0, void 0, void 0, function* () {
        bcrypt.compare.mockImplementationOnce((password, existingPassword) => {
            if (password === existingPassword) {
                return true; // Return mock data for successful verification
            }
            else {
                return false;
            }
        });
        jwt.sign.mockImplementationOnce((userData, secretToken, expiresIn) => {
            return "test:token";
        });
        const token = yield login("John", "test");
        expect(token).toBe("test:token");
    }));
    it('should test create user function with existing user creds ', () => __awaiter(void 0, void 0, void 0, function* () {
        bcrypt.genSalt.mockImplementationOnce(() => {
            return 10;
        });
        bcrypt.hash.mockImplementationOnce((password, saltRounds) => {
            return "hash#";
        });
        jwt.sign.mockImplementationOnce((userData, secretToken, expiresIn) => {
            return "test:token";
        });
        try {
            yield createUser("John", "test");
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.USER_ALREADY_EXIST);
        }
    }));
    afterEach(() => jest.clearAllMocks());
});
