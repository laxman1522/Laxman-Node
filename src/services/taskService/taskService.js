"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../utils/helper");
const fileService_1 = require("../fileService/fileService");
const logger_1 = __importDefault(require("../../logger/logger"));
const appConstants_1 = require("../../constants/appConstants/appConstants");
const TaskService = () => {
    /**
     * Method for handling the logic for creating a new task
     * @param req
     * @param res
     * @returns
     */
    const createTask = (taskParams, name) => {
        var _a;
        logger_1.default.info(appConstants_1.AppConstants.CREATE_TASK.SERVICE);
        const { title, description, priority, dueDate, taskComments } = taskParams;
        let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
        // Check if username already exists
        const existingUser = (0, helper_1.getExistingUserData)(name, tasks, appConstants_1.AppConstants.NAME);
        const task = constructTask(title, description, priority, dueDate, taskComments, existingUser);
        if (existingUser) {
            for (let data of tasks) {
                (data === null || data === void 0 ? void 0 : data.name) === name && ((_a = data === null || data === void 0 ? void 0 : data.tasks) === null || _a === void 0 ? void 0 : _a.push(task));
            }
        }
        else {
            tasks.push({ name: name, tasks: [task] });
        }
        (0, fileService_1.writeFile)(appConstants_1.AppConstants.TASK_FILE_NAME, tasks);
        return tasks;
    };
    /**
     * Method for constructing the task from the request body details
     * @param title
     * @param description
     * @param priority
     * @param dueDate
     * @param taskComments
     * @param existingUser
     * @returns
     */
    const constructTask = (title, description, priority, dueDate, taskComments, existingUser) => {
        var _a, _b, _c;
        const id = existingUser && ((_a = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _a === void 0 ? void 0 : _a.length) ? ((_c = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks[((_b = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _b === void 0 ? void 0 : _b.length) - 1]) === null || _c === void 0 ? void 0 : _c.id) + 1 : 1;
        const task = {
            id: id,
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            timeStamp: Date.now(),
            taskComments: taskComments
        };
        return task;
    };
    /**
     * Method for fetching all the task which user has created
     * @param name
     * @returns
     */
    const fetchTask = (name) => {
        logger_1.default.info(appConstants_1.AppConstants.FETCH_TASK.SERVICE);
        let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
        const existingUser = (0, helper_1.getExistingUserData)(name, tasks, appConstants_1.AppConstants.NAME);
        if (!tasks || !(tasks === null || tasks === void 0 ? void 0 : tasks.length) || !existingUser) {
            throw new Error(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
        else {
            return existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks;
        }
    };
    /**
     * method for sorting all the task based on the query params value
     * @param tasks
     * @param sortBy
     * @returns
     */
    const sortTask = (tasks, sortBy) => {
        if (!appConstants_1.AppConstants.SORTBY_PARAMS.includes(sortBy)) {
            throw new Error(appConstants_1.AppConstants.INVALID_PARAMS);
        }
        else {
            return (0, helper_1.sortData)(tasks, sortBy);
        }
    };
    /**
     * Method for fetching the indivudual task based on the given ID
     * @param tasks
     * @param taskId
     * @returns
     */
    const fetchTaskById = (tasks, taskId) => {
        return (0, helper_1.filterData)(tasks, appConstants_1.AppConstants.ID, taskId);
    };
    /**
     * Mathod for filtering the task based on the query params value
     * @param tasks
     * @param filterParam
     * @param filterParamValue
     * @returns
     */
    const filterTask = (tasks, filterParam, filterParamValue) => {
        if (appConstants_1.AppConstants.FILTER_PARAMS.includes(filterParam)) {
            return (0, helper_1.filterData)(tasks, filterParam, filterParamValue);
        }
        else {
            throw new Error(appConstants_1.AppConstants.INVALID_PARAMS);
        }
    };
    /**
     * Mathod for fetching the task based on the page number  and limit
     * @param tasks
     * @param page
     * @param limit
     * @returns
     */
    const fetchTaskBasedOnPagination = (tasks, page, limit) => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const taskList = tasks.slice(startIndex, endIndex);
        if (!taskList || !taskList.length) {
            throw new Error(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
        else {
            return taskList;
        }
    };
    /**
     * Method that handles the logic for updating the task
     * @param req
     * @param res
     */
    const updateTask = (name, taskId, updatedTasks) => {
        logger_1.default.info(appConstants_1.AppConstants.UPDATE_TASK.SERVICE);
        let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
        const existingUser = (0, helper_1.getExistingUserData)(name, tasks, appConstants_1.AppConstants.NAME);
        const taskIndex = (0, helper_1.findIndexHelper)(existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks, appConstants_1.AppConstants.ID, taskId);
        if (existingUser && taskIndex >= 0) {
            for (let data of tasks) {
                if ((data === null || data === void 0 ? void 0 : data.name) === name) {
                    data.tasks[taskIndex] = Object.assign(Object.assign({}, data.tasks[taskIndex]), updatedTasks);
                    data.tasks[taskIndex].timeStamp = Date.now();
                }
            }
            (0, fileService_1.writeFile)(appConstants_1.AppConstants.TASK_FILE_NAME, tasks);
            return tasks;
        }
        else {
            throw new Error(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
    };
    /**
     * Method handles the logic to delete the individual tasks based on the ID
     * @param req
     * @param res
     * @returns
     */
    const deleteTask = (name, taskId) => {
        logger_1.default.info(appConstants_1.AppConstants.DELETE_TASK.SERVICE);
        let isTaskAvailable = false;
        let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
        tasks = tasks === null || tasks === void 0 ? void 0 : tasks.map((task) => {
            if ((task === null || task === void 0 ? void 0 : task.name) === name) {
                //Checking whether the particular task is available 
                isTaskAvailable = (0, helper_1.checkIfTaskAvailable)(task === null || task === void 0 ? void 0 : task.tasks, appConstants_1.AppConstants.ID, Number(taskId));
                return {
                    name: name,
                    tasks: (0, helper_1.filterData)(task === null || task === void 0 ? void 0 : task.tasks, appConstants_1.AppConstants.ID, taskId, false)
                };
            }
            else {
                return task;
            }
        });
        if (isTaskAvailable) {
            (0, fileService_1.writeFile)(appConstants_1.AppConstants.TASK_FILE_NAME, tasks);
            return tasks;
        }
        else {
            throw new Error(appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
    };
    return { createTask, fetchTask, updateTask, deleteTask, sortTask, fetchTaskById, filterTask, fetchTaskBasedOnPagination };
};
exports.default = TaskService;
