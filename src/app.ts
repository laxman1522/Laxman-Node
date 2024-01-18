import fileService from "./services/FileService/fileService";
import { Express } from "express";
const dotenv = require("dotenv");
const express = require('express');
const { appConstants } = require('./constants/appConstants');
const {routeConstants} = require('./constants/routeConstants');
const logger = require('../src/logger');
const cors = require('cors');
const buddyRoute = require('./routes/Buddy/buddy');

dotenv.config();
const app : Express = express();
app.use(express.json());

const fileName: string = appConstants.FILE_PATH;
const fileContent: any = appConstants.FILE_CONTENT;

const file = new fileService();

file.fileCreation(fileName,fileContent);

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