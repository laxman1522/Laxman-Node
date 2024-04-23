"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appConstants_1 = require("../../constants/appConstants/appConstants");
const taskService_1 = __importDefault(require("../../services/taskService/taskService"));
const { createTask, fetchTask, sortTask, deleteTask, updateTask } = (0, taskService_1.default)();
const mockTasks2 = [
    {
        name: "test",
        tasks: [{
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
            }]
    }
];
jest.mock("../../services/fileService/fileService", () => ({
    readFile: () => { return mockTasks2; },
    checkIfTaskAvailable: () => true,
    writeFile: () => { }
}));
jest.mock("../../utils/helper", () => ({
    getExistingUserData: () => { return { tasks: mockTasks2.tasks }; },
    findIndexHelper: () => { return 1; },
    checkIfTaskAvailable: () => { return true; },
    sortData: () => { },
    filterData: () => { }
}));
const mockTasks = [
    {
        title: "test",
        description: "test",
        priority: "medium",
        dueDate: "2024-10-10",
        comments: []
    },
    {
        title: "test",
        description: "test",
        priority: "high",
        dueDate: "2024-10-10",
        comments: []
    },
    {
        title: "test",
        description: "test",
        priority: "low",
        dueDate: "2024-10-10",
        comments: []
    }
];
describe('task service test cases', () => {
    it("should test create task with proper task params", () => {
        var _a;
        const taskParams = mockTasks[0];
        const tasks = createTask(taskParams, "test");
        expect((_a = tasks[0]) === null || _a === void 0 ? void 0 : _a.tasks).not.toBeNull();
    });
    it("should test fetch task without valid user name", () => {
        try {
            const tasks = fetchTask("test");
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
    });
    it("should test sortBy task with valid query param", () => {
        const tasks = sortTask(mockTasks, "priority");
        expect(tasks).not.toBeNull();
    });
    it("should test sortBy task without valid query param", () => {
        try {
            const tasks = sortTask(mockTasks, "prior");
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.INVALID_PARAMS);
        }
    });
    it("should test delete task with valid task id and user", () => {
        try {
            const tasks = deleteTask("test", 1);
            expect(tasks).not.toBeNull();
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
    });
    it("should test delete task without valid user", () => {
        try {
            const tasks = deleteTask("tes", 1);
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
    });
    it("should test update task without valid user", () => {
        try {
            const tasks = updateTask("tes", 1);
        }
        catch (error) {
            expect(error.message).toBe(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
    });
    it("should test update task with valid user", () => {
        const tasks = updateTask("test", 1);
        expect(tasks).not.toBe(null);
    });
    it("should test create task with valid user", () => {
        const tasks = createTask(mockTasks[0], "test");
        expect(tasks).not.toBe(null);
    });
});
