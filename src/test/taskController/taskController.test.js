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
const taskController_1 = __importDefault(require("../../controller/taskController/taskController"));
const taskService_1 = __importDefault(require("../../services/taskService/taskService"));
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');
const mockTasks2 = [
    {
        name: "test",
        tasks: [
            {
                id: 1,
                title: "test",
                description: "test",
                priority: "medium",
                dueDate: "2024-10-10",
                comments: []
            },
            {
                id: 2,
                title: "test",
                description: "test",
                priority: "high",
                dueDate: "2024-10-10",
                comments: []
            },
            {
                id: 3,
                title: "test",
                description: "test",
                priority: "low",
                dueDate: "2024-10-10",
                comments: []
            }
        ]
    }
];
describe("it should test Task Controller", () => {
    let mockFetchTask;
    let mockFetchTaskById;
    beforeAll(() => {
        var _a, _b;
        const mockUserData = { name: 'test' };
        jwt.verify.mockImplementation((tokenToVerify, secret) => {
            return mockUserData; // Return mock data for successful verification
        });
        mockFetchTask = jest.spyOn(taskService_1.default, 'fetchTask').mockReturnValue((_a = mockTasks2[0]) === null || _a === void 0 ? void 0 : _a.tasks);
        mockFetchTaskById = jest.spyOn(taskService_1.default, 'fetchTaskById').mockReturnValue((_b = mockTasks2[0]) === null || _b === void 0 ? void 0 : _b.tasks[1]);
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
    it("should test getTask with proper creds", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' }
        });
        let res = httpMocks.createResponse();
        const mockFetchTask = jest.spyOn(taskService_1.default, 'fetchTask').mockReturnValue((_a = mockTasks2[0]) === null || _a === void 0 ? void 0 : _a.tasks);
        const taskController = (0, taskController_1.default)();
        taskController.fetchTask(req, res);
        const data = res._getJSONData();
        expect((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.tasks.length).toBe(3);
        expect(mockFetchTask).toHaveBeenCalled();
    }));
    it("should test getTask with proper creds along with Task ID", () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' },
            params: {
                id: 2,
            }
        });
        let res = httpMocks.createResponse();
        const taskController = (0, taskController_1.default)();
        taskController.fetchTask(req, res);
        const data = res._getJSONData();
        expect((_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.tasks.id).toBe(2);
        expect(mockFetchTask).toHaveBeenCalled();
        expect(mockFetchTaskById).toHaveBeenCalled();
    }));
    it("should test getTask with invalid query params", () => __awaiter(void 0, void 0, void 0, function* () {
        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' },
            query: {
                test: 2,
            }
        });
        let res = httpMocks.createResponse();
        const taskController = (0, taskController_1.default)();
        taskController.fetchTask(req, res);
        const data = res._getData();
        expect(JSON.parse(data).message).toEqual("Invalid Request");
    }));
    it("should test getTask with filter query", () => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' },
            query: {
                priority: "high",
            }
        });
        let res = httpMocks.createResponse();
        const taskController = (0, taskController_1.default)();
        taskController.fetchTask(req, res);
        const data = res._getJSONData();
        expect((_d = data === null || data === void 0 ? void 0 : data.data) === null || _d === void 0 ? void 0 : _d.tasks.length).toBe(1);
    }));
});
