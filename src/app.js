"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileService_1 = __importDefault(require("./services/FileService/fileService"));
const dotenv = require("dotenv");
const express = require('express');
const { appConstants } = require('./constants/appConstants');
const { routeConstants } = require('./constants/routeConstants');
const logger = require('../src/logger');
const cors = require('cors');
const buddyRoute = require('./routes/Buddy/buddy');
dotenv.config();
const app = express();
app.use(express.json());
const fileName = appConstants.FILE_PATH;
const fileContent = appConstants.FILE_CONTENT;
const file = new fileService_1.default();
file.fileCreation(fileName, fileContent);
app.use(cors({
    origin: '*',
}));
app.use(routeConstants.BUDDY_ROUTES.BUDDY, buddyRoute);
app.listen(process.env.PORT, () => {
    logger.info(`App started in ${process.env.PORT}`);
});
app.listen(3002, () => {
    logger.info(`App started in 3002`);
});
