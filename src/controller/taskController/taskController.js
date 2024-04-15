"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appConstants_1 = require("../../constants/appConstants/appConstants");
const logger_1 = __importDefault(require("../../logger/logger"));
const taskService_1 = __importDefault(require("../../services/taskService/taskService"));
const taskService = (0, taskService_1.default)();
const TaskController = () => {
    const createTask = (req, res) => {
        logger_1.default.info(appConstants_1.AppConstants.CREATE_TASK.CONTROLLER);
        taskService.createTask(req, res);
    };
    const fetchTask = (req, res) => {
        logger_1.default.info(appConstants_1.AppConstants.FETCH_TASK.CONTROLLER);
        taskService.fetchTask(req, res);
    };
    const updateTask = (req, res) => {
        logger_1.default.info(appConstants_1.AppConstants.UPDATE_TASK.CONTROLLER);
        taskService.updateTask(req, res);
    };
    const deleteTask = (req, res) => {
        logger_1.default.info(appConstants_1.AppConstants.DELETE_TASK.CONTROLLER);
        taskService.deleteTask(req, res);
    };
    const sortTask = (req, res) => {
        taskService.sortTask(req, res);
    };
    return { createTask, fetchTask, updateTask, deleteTask, sortTask };
};
exports.default = TaskController;
