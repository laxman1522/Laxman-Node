"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var express = require("express");
var jwt = require("jsonWebToken");
var logger = require('./logger');
var routeConstants = require('./constants/RouteConstants');
dotenv.config();
var app = express();
app.use(express.json());
var port = process.env.PORT;
app.post(routeConstants.LOGIN, function (req, res) {
    var _a;
    var userName = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username;
    var user = { name: userName };
    var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});
app.listen(port, function () {
    logger.info("[server]: Server is running at http://localhost:".concat(port));
});
