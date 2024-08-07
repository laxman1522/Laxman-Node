"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appConstants_1 = require("../../constants/appConstants/appConstants");
const logger_1 = __importDefault(require("../../logger/logger"));
const taskService_1 = __importDefault(require("../../services/taskService/taskService"));
const helper_1 = require("../../utils/helper");
const TaskController = () => {
    /**
     * Method for creating a task for individual user
     * @param req
     * @param res
     */
    const createTask = (req, res) => {
        var _a, _b;
        logger_1.default.info(appConstants_1.AppConstants.CREATE_TASK.CONTROLLER);
        try {
            const error = (0, helper_1.isValidParams)(req === null || req === void 0 ? void 0 : req.body);
            if (!error && !!((_a = Object.keys(req === null || req === void 0 ? void 0 : req.body)) === null || _a === void 0 ? void 0 : _a.length)) {
                const tasks = taskService_1.default.createTask(req === null || req === void 0 ? void 0 : req.body, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.name);
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.CREATED, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_CREATED_SUCCESSFULLY, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.BAD_REQUEST, false, true, (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, {});
            }
        }
        catch (error) {
            return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
        }
    };
    /**
     * Method for fetching all the tasks which the individual user has created
     * @param req
     * @param res
     */
    const fetchTask = (req, res) => {
        var _a, _b, _c, _d, _e;
        logger_1.default.info(appConstants_1.AppConstants.FETCH_TASK.CONTROLLER);
        try {
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = Number((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id);
            const sortBy = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.sortBy;
            const page = Number((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.page);
            const limit = Number((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.limit);
            const queryParam = req === null || req === void 0 ? void 0 : req.query;
            const queryParamKeys = Object.keys(queryParam);
            //Checking for any invalid query params
            for (const queryParam of queryParamKeys) {
                if (!appConstants_1.AppConstants.FILTER_PARAMS.includes(queryParam) && !appConstants_1.AppConstants.PAGINATION_PARAMS.includes(queryParam) && queryParam !== appConstants_1.AppConstants.SORTBY) {
                    return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.BAD_REQUEST, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, {});
                }
            }
            //filtering the filter query param list
            const filterQueryParamList = (0, helper_1.filterParamsByValue)(queryParamKeys, appConstants_1.AppConstants.FILTER_PARAMS);
            //fetching all the task created by the user
            let tasks = taskService_1.default.fetchTask(name);
            let totalTasks = 0;
            //Logic for filtering the tasks based on the filter param
            filterQueryParamList === null || filterQueryParamList === void 0 ? void 0 : filterQueryParamList.forEach((filterQueryParam) => {
                queryParam[filterQueryParam] && (tasks = taskService_1.default.filterTask(tasks, filterQueryParam, queryParam[filterQueryParam]));
            });
            //Fetching task based on the individual id
            if (taskId) {
                tasks = taskService_1.default.fetchTaskById(tasks, taskId);
            }
            else {
                sortBy && (tasks = taskService_1.default.sortTask(tasks, sortBy));
            }
            let data = {};
            totalTasks = tasks === null || tasks === void 0 ? void 0 : tasks.length;
            if (page && limit) {
                (page && limit) && (tasks = taskService_1.default.fetchTaskBasedOnPagination(tasks, page, limit));
                data = {
                    tasks: tasks,
                    totalTasks: totalTasks,
                    currentPage: page,
                    limit: limit,
                    totalPages: Math.ceil(totalTasks / limit)
                };
            }
            else {
                data = {
                    tasks: tasks,
                    totalTasks: totalTasks
                };
            }
            if (tasks && !!tasks.length) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_FETCH, data);
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, data);
            }
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.TASK_NOT_FOUND) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    };
    /**
     * Method for updating the tasks based on the ID
     * @param req
     * @param res
     */
    const updateTask = (req, res) => {
        var _a, _b, _c;
        logger_1.default.info(appConstants_1.AppConstants.UPDATE_TASK.CONTROLLER);
        try {
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
            const updatedTasks = req === null || req === void 0 ? void 0 : req.body;
            const error = (0, helper_1.isValidParams)(req === null || req === void 0 ? void 0 : req.body);
            if (!error && !!((_c = Object.keys(updatedTasks)) === null || _c === void 0 ? void 0 : _c.length)) {
                taskService_1.default.updateTask(name, Number(taskId), updatedTasks);
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_UPDATE, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.BAD_REQUEST, false, true, (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, {});
            }
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.TASK_NOT_FOUND) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    };
    /**
     * Method for deleting the task which the individual user has created based on the ID
     * @param req
     * @param res
     */
    const deleteTask = (req, res) => {
        var _a, _b;
        logger_1.default.info(appConstants_1.AppConstants.DELETE_TASK.CONTROLLER);
        try {
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
            taskService_1.default.deleteTask(name, Number(taskId));
            return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_DELETED_SUCCESSFULLY, {});
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.TASK_NOT_FOUND) {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND, {});
            }
            else {
                return (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    };
    return { createTask, fetchTask, updateTask, deleteTask };
};
exports.default = TaskController;
