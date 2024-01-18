import { Express, Request, Response } from "express";
import logger from './logger/logger';

const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonWebToken");

// const logger = require('./logger');
const routeConstants = require('./constants/RouteConstants');

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

app.post(routeConstants.LOGIN, (req: Request, res: Response) => {
  const userName = req?.body?.username;
  const user = {name: userName};
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken});
});
 
app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
}); 