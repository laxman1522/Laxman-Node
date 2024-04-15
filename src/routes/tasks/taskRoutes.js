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
const userController_1 = __importDefault(require("../../controller/userController/userController"));
const taskController_1 = __importDefault(require("../../controller/taskController/taskController"));
const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const TaskRoute = express.Router();
const userController = (0, userController_1.default)();
const taskController = (0, taskController_1.default)();
TaskRoute.post('', userController.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield taskController.createTask(req, res);
}));
TaskRoute.get('', userController.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield taskController.fetchTask(req, res);
}));
TaskRoute.get(routeConstants.TASK_ID, userController.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield taskController.fetchTask(req, res);
}));
TaskRoute.patch(routeConstants.TASK_ID, userController.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield taskController.updateTask(req, res);
}));
TaskRoute.delete(routeConstants.TASK_ID, userController.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield taskController.deleteTask(req, res);
}));
exports.default = TaskRoute;
