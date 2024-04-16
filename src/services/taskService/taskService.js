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
        var _a, _b;
        const task = {
            id: existingUser ? ((_b = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks[((_a = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _a === void 0 ? void 0 : _a.length) - 1]) === null || _b === void 0 ? void 0 : _b.id) + 1 : 1,
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
     * method to construct the pagination request response
     * @param tasks
     * @param totalTasks
     * @param currentPage
     * @param limit
     * @param totalPages
     * @returns
     */
    const constructPaginationResponse = (tasks, totalTasks, currentPage, limit, totalPages) => {
        return {
            tasks: tasks,
            totalTasks: totalTasks,
            currentPage: currentPage,
            limit: limit,
            totalPages: totalPages
        };
    };
    /**
     * Method Handles the logic for fetching all the tasks, tasks based on the id, filter and sort tasks
     * @param req
     * @param res
     * @returns
     */
    const fetchTask = (req, res) => {
        var _a, _b, _c, _d, _e;
        try {
            logger_1.default.info(appConstants_1.AppConstants.FETCH_TASK.SERVICE);
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
            const sortBy = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.sortBy;
            const page = Number((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.page);
            const limit = Number((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.limit);
            const filterParams = appConstants_1.AppConstants.FILTER_PARAMS;
            const filterParam = Object.keys(req === null || req === void 0 ? void 0 : req.query)[0];
            const filterParamValue = req === null || req === void 0 ? void 0 : req.query[filterParam];
            let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
            tasks = (0, helper_1.parseData)(tasks);
            const existingUser = (0, helper_1.getExistingUserData)(name, tasks, appConstants_1.AppConstants.NAME);
            if (sortBy) { //Sorting Logic
                if (!appConstants_1.AppConstants.SORTBY_PARAMS.includes(sortBy)) {
                    // return setResponse(res,400,AppConstants.MESSAGE,AppConstants.INVALID_PARAMS);
                }
                else {
                    tasks = (0, helper_1.sortData)(existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks, sortBy);
                    if (page && limit) {
                        paginationHandler(page, limit, tasks, res);
                        return null;
                    }
                }
            }
            else if (filterParamValue) { //Filter Logic
                if (filterParams.includes(filterParam)) {
                    tasks = (0, helper_1.filterData)(existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks, filterParam, filterParamValue);
                    if (page && limit) {
                        paginationHandler(page, limit, tasks, res);
                        return null;
                    }
                }
                else {
                    // return setResponse(res,400,AppConstants.MESSAGE,AppConstants.INVALID_PARAMS);
                }
            }
            else if (taskId) { // fetching the tasks based on the individual tasks id
                tasks = (0, helper_1.filterData)(existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks, appConstants_1.AppConstants.ID, Number(taskId));
            }
            else {
                tasks = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks;
            }
            if (!tasks || !(tasks === null || tasks === void 0 ? void 0 : tasks.length) || !existingUser) {
                // return setResponse(res,404,AppConstants.MESSAGE,AppConstants.TASK_NOT_FOUND);
            }
            else {
                // return setResponse(res,200,AppConstants.TASK_DATA,tasks);
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.FETCH_TASK.ERROR);
            // return setResponse(res,500,AppConstants.ERROR, AppConstants.INTERNAL_SERVER_ERROR);
        }
    };
    const paginationHandler = (page, limit, tasks, res) => {
        var _a;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const test = tasks;
        const taskList = test.slice(startIndex, endIndex);
        const paginationResponse = constructPaginationResponse(taskList, tasks === null || tasks === void 0 ? void 0 : tasks.length, page, limit, Math.ceil((tasks === null || tasks === void 0 ? void 0 : tasks.length) / limit));
        if (!(paginationResponse === null || paginationResponse === void 0 ? void 0 : paginationResponse.tasks) || !((_a = paginationResponse === null || paginationResponse === void 0 ? void 0 : paginationResponse.tasks) === null || _a === void 0 ? void 0 : _a.length)) {
            // return setResponse(res,404,AppConstants.MESSAGE,AppConstants.TASK_NOT_FOUND);
        }
        else {
            // return setResponse(res,200,AppConstants.MESSAGE,paginationResponse);
        }
    };
    /**
     * Method that handles the logic for updating the task
     * @param req
     * @param res
     */
    const updateTask = (req, res) => {
        var _a, _b, _c;
        try {
            logger_1.default.info(appConstants_1.AppConstants.UPDATE_TASK.SERVICE);
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
            const updatedTasks = req === null || req === void 0 ? void 0 : req.body;
            // Validate the request body
            const error = (0, helper_1.isValidParams)(req === null || req === void 0 ? void 0 : req.body);
            if (!((_c = Object.keys(updatedTasks)) === null || _c === void 0 ? void 0 : _c.length) || error) {
                // return setResponse(res,400,AppConstants.ERROR,!error ? AppConstants.INVALID_REQUEST : error?.details[0]?.message);
            }
            for (let key of Object.keys(updatedTasks)) {
                if (!appConstants_1.AppConstants.TASK_KEYS.includes(key)) {
                    // return setResponse(res,400,AppConstants.ERROR,AppConstants.INVALID_REQUEST);
                }
            }
            let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
            tasks = (0, helper_1.parseData)(tasks);
            const existingUser = (0, helper_1.getExistingUserData)(name, tasks, appConstants_1.AppConstants.NAME);
            const taskIndex = (0, helper_1.findIndexHelper)(existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks, appConstants_1.AppConstants.ID, Number(taskId));
            if (existingUser && taskIndex >= 0) {
                for (let data of tasks) {
                    if ((data === null || data === void 0 ? void 0 : data.name) === name) {
                        data.tasks[taskIndex] = Object.assign(Object.assign({}, data.tasks[taskIndex]), updatedTasks);
                        data.tasks[taskIndex].timeStamp = Date.now();
                    }
                }
                (0, fileService_1.writeFile)(appConstants_1.AppConstants.TASK_FILE_NAME, tasks);
                // return setResponse(res,200,AppConstants.MESSAGE,AppConstants.UPDATED);
            }
            else {
                // return setResponse(res,404,AppConstants.MESSAGE,AppConstants.TASK_NOT_FOUND);
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.UPDATE_TASK.ERROR);
            // return setResponse(res,500,AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
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
                    tasks: (0, helper_1.filterData)(task === null || task === void 0 ? void 0 : task.tasks, appConstants_1.AppConstants.ID, Number(taskId), false)
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
    return { createTask, fetchTask, updateTask, deleteTask };
};
exports.default = TaskService;
