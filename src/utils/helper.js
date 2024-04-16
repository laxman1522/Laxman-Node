"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidParams = exports.findIndexHelper = exports.setResponse = exports.checkIfTaskAvailable = exports.parseData = exports.filterData = exports.sortData = exports.getExistingUserData = exports.isValidDate = void 0;
const appConstants_1 = require("../constants/appConstants/appConstants");
const joi_1 = __importDefault(require("joi"));
const isValidDate = (date) => {
    const currentDate = new Date();
    const dateParts = date.split("/");
    // Ensure correct number of parts
    if (dateParts.length !== 3) {
        return false;
    }
    const [day, month, year] = dateParts;
    // Validate individual parts
    if (!Number.isInteger(parseInt(year)) ||
        !Number.isInteger(parseInt(month)) ||
        !Number.isInteger(parseInt(day))) {
        return false;
    }
    // Attempt to create a Date object with manual parsing
    const parsedDate = new Date(year, parseInt(month) - 1, day); // Adjust month for 0-based indexing
    // Check for valid Date object and reasonable year range
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && (parsedDate.getTime() > currentDate.getTime());
};
exports.isValidDate = isValidDate;
const getExistingUserData = (userName, usersData, param) => {
    // Check if username already exists
    const existingUser = usersData && (usersData === null || usersData === void 0 ? void 0 : usersData.find((user) => user[param] === userName));
    return existingUser;
};
exports.getExistingUserData = getExistingUserData;
const sortData = (data, param) => {
    const sortData = data.sort((data1, data2) => {
        var _a;
        if (typeof (data1[param]) === "string") {
            return (_a = data1[param]) === null || _a === void 0 ? void 0 : _a.localeCompare(data2[param]);
        }
        else if (typeof (data1[param] instanceof Date)) {
            return data1[param] - data2[param];
        }
    });
    return sortData;
};
exports.sortData = sortData;
const filterData = (data, filterParam, filterParamValue, equal = true) => {
    return data === null || data === void 0 ? void 0 : data.filter((data) => equal ? data[filterParam] === filterParamValue : data[filterParam] !== filterParamValue);
};
exports.filterData = filterData;
const parseData = (data) => {
    try {
        return JSON.parse(data);
    }
    catch (err) {
        return null;
    }
};
exports.parseData = parseData;
const checkIfTaskAvailable = (data, param, paramValue) => {
    return data === null || data === void 0 ? void 0 : data.some((data) => data[param] === paramValue);
};
exports.checkIfTaskAvailable = checkIfTaskAvailable;
const setResponse = (res, status, success, error, message, data) => {
    return res.status(status).json({
        success: success,
        error: error,
        message: message,
        data: data
    });
};
exports.setResponse = setResponse;
const findIndexHelper = (data, param, paramValue) => {
    return data === null || data === void 0 ? void 0 : data.findIndex((data) => data[param] === paramValue);
};
exports.findIndexHelper = findIndexHelper;
const isValidParams = (requestBody) => {
    const today = new Date().toISOString().slice(0, 10);
    const taskSchema = joi_1.default.object({
        title: joi_1.default.string().min(3).max(255),
        description: joi_1.default.string().allow(null, ''), // Optional description
        priority: joi_1.default.string().valid(appConstants_1.AppConstants.PRIORITY_LOW, appConstants_1.AppConstants.PRIORITY_MEDIUM, appConstants_1.AppConstants.PRIORITY_HIGH),
        dueDate: joi_1.default.date().min(today),
        taskComments: joi_1.default.array()
    });
    // Validate the request body
    const { error } = taskSchema.validate(requestBody);
    return error ? error : null;
};
exports.isValidParams = isValidParams;
