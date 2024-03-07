import { Express } from "express";
import logger from './logger/logger';
import router from "./routes/users/userRoute";

const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

app.use('/',router);
 
app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
}); 