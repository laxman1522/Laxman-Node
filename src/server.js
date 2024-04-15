"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger/logger"));
const userRoute_1 = __importDefault(require("./routes/users/userRoute"));
const taskRoutes_1 = __importDefault(require("./routes/tasks/taskRoutes"));
const dotenv = require("dotenv");
const express = require("express");
const routeConstants = require('./constants/routeConstants');
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
app.use('/', userRoute_1.default);
app.use(routeConstants.TASK, taskRoutes_1.default);
app.listen(port, () => {
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
});
