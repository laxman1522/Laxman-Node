import fileService from "./services/fileService";
const express = require('express');
const { appConstants } = require('./constants/appConstants');
const logger = require('../src/logger');
const cors = require('cors')

const app = express();

app.use(express.json());

const PORT = appConstants.PORT;

const fileName = appConstants.FILE_PATH;
const fileContent = appConstants.FILE_CONTENT;

const file = new fileService();

file.fileCreation(fileName,fileContent);

app.use(cors({
    origin: '*', 
  }));

const buddyRoute = require('./routes/buddy');

app.use('/buddy', buddyRoute);
app.use('/buddies', buddyRoute);

app.listen(PORT, () => {
    logger.info(`App started in ${PORT}`);
});