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
    const createTask = (req, res) => {
        var _a, _b, _c, _d;
        try {
            logger_1.default.info(appConstants_1.AppConstants.CREATE_TASK.SERVICE);
            // Validate the request body
            const error = (0, helper_1.isValidParams)(req === null || req === void 0 ? void 0 : req.body);
            const { title, description, priority, dueDate, taskComments } = req === null || req === void 0 ? void 0 : req.body;
            if (!error && !!((_a = Object.keys(req === null || req === void 0 ? void 0 : req.body)) === null || _a === void 0 ? void 0 : _a.length)) {
                const name = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.name;
                let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
                tasks = (0, helper_1.parseData)(tasks);
                // Check if username already exists
                const existingUser = (0, helper_1.getExistingUserData)(name, tasks, appConstants_1.AppConstants.NAME);
                const task = constructTask(title, description, priority, dueDate, taskComments, existingUser);
                if (existingUser) {
                    for (let data of tasks) {
                        (data === null || data === void 0 ? void 0 : data.name) === name && ((_c = data === null || data === void 0 ? void 0 : data.tasks) === null || _c === void 0 ? void 0 : _c.push(task));
                    }
                }
                else {
                    tasks.push({ name: name, tasks: [task] });
                }
                (0, fileService_1.writeFile)(appConstants_1.AppConstants.TASK_FILE_NAME, tasks);
                return (0, helper_1.setResponse)(res, 200, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.TASK_CREATED_SUCCESSFULLY);
            }
            else {
                return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, (_d = error === null || error === void 0 ? void 0 : error.details[0]) === null || _d === void 0 ? void 0 : _d.message);
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.CREATE_TASK.ERROR);
            return (0, helper_1.setResponse)(res, 500, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INTERNAL_SERVER_ERROR);
        }
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
                    return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.INVALID_PARAMS);
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
                    return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.INVALID_PARAMS);
                }
            }
            else if (taskId) { // fetching the tasks based on the individual tasks id
                tasks = (0, helper_1.filterData)(existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks, appConstants_1.AppConstants.ID, Number(taskId));
            }
            else {
                tasks = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks;
            }
            if (!tasks || !(tasks === null || tasks === void 0 ? void 0 : tasks.length) || !existingUser) {
                return (0, helper_1.setResponse)(res, 404, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.TASK_NOT_FOUND);
            }
            else {
                return (0, helper_1.setResponse)(res, 200, appConstants_1.AppConstants.TASK_DATA, tasks);
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.FETCH_TASK.ERROR);
            return (0, helper_1.setResponse)(res, 500, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INTERNAL_SERVER_ERROR);
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
            return (0, helper_1.setResponse)(res, 404, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.TASK_NOT_FOUND);
        }
        else {
            return (0, helper_1.setResponse)(res, 200, appConstants_1.AppConstants.MESSAGE, paginationResponse);
        }
    };
    /**
     * Method that handles the logic for updating the task
     * @param req
     * @param res
     */
    const updateTask = (req, res) => {
        var _a, _b, _c, _d;
        try {
            logger_1.default.info(appConstants_1.AppConstants.UPDATE_TASK.SERVICE);
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
            const updatedTasks = req === null || req === void 0 ? void 0 : req.body;
            // Validate the request body
            const error = (0, helper_1.isValidParams)(req === null || req === void 0 ? void 0 : req.body);
            if (!((_c = Object.keys(updatedTasks)) === null || _c === void 0 ? void 0 : _c.length) || error) {
                return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, !error ? appConstants_1.AppConstants.INVALID_REQUEST : (_d = error === null || error === void 0 ? void 0 : error.details[0]) === null || _d === void 0 ? void 0 : _d.message);
            }
            for (let key of Object.keys(updatedTasks)) {
                if (!appConstants_1.AppConstants.TASK_KEYS.includes(key)) {
                    return (0, helper_1.setResponse)(res, 400, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INVALID_REQUEST);
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
                return (0, helper_1.setResponse)(res, 200, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.UPDATED);
            }
            else {
                return (0, helper_1.setResponse)(res, 404, appConstants_1.AppConstants.MESSAGE, appConstants_1.AppConstants.TASK_NOT_FOUND);
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.UPDATE_TASK.ERROR);
            return (0, helper_1.setResponse)(res, 500, appConstants_1.AppConstants.ERROR, appConstants_1.AppConstants.INTERNAL_SERVER_ERROR);
        }
    };
    /**
     * Method handles the logic to delete the individual tasks based on the ID
     * @param req
     * @param res
     * @returns
     */
    const deleteTask = (req, res) => {
        var _a, _b;
        logger_1.default.info(appConstants_1.AppConstants.DELETE_TASK.SERVICE);
        try {
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
            let isTaskAvailable = false;
            let tasks = (0, fileService_1.readFile)(appConstants_1.AppConstants.TASK_FILE_NAME);
            tasks = (0, helper_1.parseData)(tasks);
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
                res.status(200).json({ message: appConstants_1.AppConstants.TASK_DELETED });
            }
            else {
                res.status(404).json({ message: appConstants_1.AppConstants.TASK_NOT_FOUND });
            }
        }
        catch (err) {
            logger_1.default.error(appConstants_1.AppConstants.DELETE_TASK.ERROR);
            return res.status(500).json({ error: appConstants_1.AppConstants.INTERNAL_SERVER_ERROR });
        }
    };
    return { createTask, fetchTask, updateTask, deleteTask };
};
exports.default = TaskService;
