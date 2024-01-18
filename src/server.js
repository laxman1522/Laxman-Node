"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger/logger"));
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonWebToken");
// const logger = require('./logger');
const routeConstants = require('./constants/RouteConstants');
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
app.post(routeConstants.LOGIN, (req, res) => {
    var _a;
    const userName = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username;
    const user = { name: userName };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});
app.listen(port, () => {
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
});
