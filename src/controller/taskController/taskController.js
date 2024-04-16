"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appConstants_1 = require("../../constants/appConstants/appConstants");
const logger_1 = __importDefault(require("../../logger/logger"));
const taskService_1 = __importDefault(require("../../services/taskService/taskService"));
const helper_1 = require("../../utils/helper");
const taskService = (0, taskService_1.default)();
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
                const tasks = taskService.createTask(req === null || req === void 0 ? void 0 : req.body, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.name);
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.CREATED, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_CREATED_SUCCESSFULLY, {});
            }
            else {
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.BAD_REQUEST, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST, {});
            }
        }
        catch (error) {
            (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
        }
    };
    /**
     * Method for fetching all the tasks which the individual user has created
     * @param req
     * @param res
     */
    const fetchTask = (req, res) => {
        logger_1.default.info(appConstants_1.AppConstants.FETCH_TASK.CONTROLLER);
        taskService.fetchTask(req, res);
    };
    const updateTask = (req, res) => {
        logger_1.default.info(appConstants_1.AppConstants.UPDATE_TASK.CONTROLLER);
        taskService.updateTask(req, res);
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
            taskService.deleteTask((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name, (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id);
            (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, true, false, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_DELETED_SUCCESSFULLY, {});
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === appConstants_1.AppConstants.TASK_NOT_FOUND) {
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.SUCCESS, false, true, appConstants_1.AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND, {});
            }
            else {
                (0, helper_1.setResponse)(res, appConstants_1.AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, error === null || error === void 0 ? void 0 : error.message, {});
            }
        }
    };
    const sortTask = (req, res) => {
        taskService.sortTask(req, res);
    };
    return { createTask, fetchTask, updateTask, deleteTask, sortTask };
};
exports.default = TaskController;
