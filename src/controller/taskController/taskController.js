"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskService_1 = __importDefault(require("../../services/taskService/taskService"));
const taskService = (0, taskService_1.default)();
const TaskController = () => {
    const createTask = (req, res) => {
        try {
            taskService.createTask(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server error");
        }
    };
    const fetchTask = (req, res) => {
        try {
            taskService.fetchTask(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server error");
        }
    };
    const updateTask = (req, res) => {
        try {
            taskService.updateTask(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server error");
        }
    };
    const deleteTask = (req, res) => {
        try {
            taskService.deleteTask(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server error");
        }
    };
    const sortTask = (req, res) => {
        try {
            taskService.sortTask(req, res);
        }
        catch (err) {
            res.status(500).json("Internal Server error");
        }
    };
    return { createTask, fetchTask, updateTask, deleteTask, sortTask };
};
exports.default = TaskController;
