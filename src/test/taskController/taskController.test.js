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
const supertest_1 = __importDefault(require("supertest"));
const appConstants_1 = require("../../constants/appConstants/appConstants");
const { app } = require('../../server');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');
describe("it should test Task Controller", () => {
    it("should test getTask", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).get('/task').expect(403).then((result) => {
            expect(result.text && JSON.parse(result.text).message).toBe(appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN);
        });
    }));
    it("should test getTask without valid creds", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).get('/task').expect(403).then((result) => {
            expect(result.text && JSON.parse(result.text).message).toBe(appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN);
        });
    }));
    it("should test getTask with proper creds", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUserData = { name: 'test' };
        jwt.verify.mockImplementationOnce((tokenToVerify, secret) => {
            return mockUserData; // Return mock data for successful verification
        });
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGF4bWFuYXBhbmRpIiwiaWF0IjoxNzEzMzIyNDIyLCJleHAiOjE3MTMzMjQyMjJ9.EVJUd4tR-NT86mW44gLAGSGn_Bf3v1lfoNDVqIQASbs";
        yield (0, supertest_1.default)(app).get('/task').set('Authorization', `Bearer ${token}`).expect(200).then((result) => {
            expect(result.text && JSON.parse(result.text).message).toBe(appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_FETCH);
        });
    }));
    it("should test getTask with proper creds along with sortBy query", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUserData = { name: 'test' };
        const queryObject = {
            sortBy: "priority"
        };
        jwt.verify.mockImplementationOnce((tokenToVerify, secret) => {
            return mockUserData; // Return mock data for successful verification
        });
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGF4bWFuYXBhbmRpIiwiaWF0IjoxNzEzMzIyNDIyLCJleHAiOjE3MTMzMjQyMjJ9.EVJUd4tR-NT86mW44gLAGSGn_Bf3v1lfoNDVqIQASbs";
        yield (0, supertest_1.default)(app).get('/task').set('Authorization', `Bearer ${token}`).query(queryObject).expect(200).then((result) => {
            expect(result.text && JSON.parse(result.text).message).toBe(appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_FETCH);
        });
    }));
    it("should test getTask with proper creds along with taskID", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUserData = { name: 'test' };
        jwt.verify.mockImplementationOnce((tokenToVerify, secret) => {
            return mockUserData; // Return mock data for successful verification
        });
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGF4bWFuYXBhbmRpIiwiaWF0IjoxNzEzMzIyNDIyLCJleHAiOjE3MTMzMjQyMjJ9.EVJUd4tR-NT86mW44gLAGSGn_Bf3v1lfoNDVqIQASbs";
        yield (0, supertest_1.default)(app).get('/task/1').set('Authorization', `Bearer ${token}`).expect(200).then((result) => {
            expect(result.text && JSON.parse(result.text).message).toBe(appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_FETCH);
        });
    }));
});
