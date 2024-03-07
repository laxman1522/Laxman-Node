"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger/logger"));
const userRoute_1 = __importDefault(require("./routes/users/userRoute"));
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
app.use('/', userRoute_1.default);
app.listen(port, () => {
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
});
