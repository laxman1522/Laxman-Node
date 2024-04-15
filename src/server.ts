import { Express } from "express";
import logger from './logger/logger';
import router from "./routes/users/userRoute";
import TaskRoute from './routes/tasks/taskRoutes';

const dotenv = require("dotenv");
const express = require("express");
const routeConstants = require('./constants/routeConstants');

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

app.use('/',router);
app.use(routeConstants.TASK,TaskRoute);
 
app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
}); 