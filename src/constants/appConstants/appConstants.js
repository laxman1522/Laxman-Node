"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConstants = void 0;
exports.AppConstants = {
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    USER_ALREADY_EXIST: "User Already Exist",
    INVALID_CREDENTIALS: "Please verify the credentials",
    USER_NOT_FOUND: "User doesn't exist",
    UNAUTHORIZED: "Unauthorized",
    INVALID_TOKEN: "Invalid Token",
    AUTHORIZATION: 'authorization',
    TASK_NOT_FOUND: 'Tasks not found',
    FILTER_PARAMS: ["title", "priority", "dueDate"],
    SORTBY_PARAMS: ["title", "priority", "dueDate"],
    TASK_FILE_NAME: 'tasks.json',
    USER_FILE_NAME: 'users.json',
    USERNAME: "userName",
    ACCESS_TOKEN: "Access Token",
    INVALID_PARAMS: 'Invalid Params',
    INVALID_REQUEST: 'Invalid Request',
    SORTBY: 'sortBy',
    ID: 'id',
    TASK_DELETED: "Task deleted successfully ",
    DELETE_TASK: {
        SERVICE: "Delete Task Service initializing",
        ERROR: "Delete Task Service Error",
        CONTROLLER: "Delete Task Controller initializing"
    },
    FETCH_TASK: {
        SERVICE: "Fetch Task Service initializing",
        ERROR: "Fetch Task Service Error",
        CONTROLLER: "Fetch Task Controller initializing"
    },
    UPDATE_TASK: {
        SERVICE: "Update Task Service initializing",
        ERROR: "Update Task Service Error",
        CONTROLLER: "Update Task Controller initializing"
    },
    CREATE_TASK: {
        SERVICE: "Create Task Service initializing",
        ERROR: "Create Task Service Error",
        CONTROLLER: "Create Task Controller initializing"
    },
    CREATE_USER: {
        SERVICE: "Create User Service initializing",
        ERROR: "Create User Service Error",
        CONTROLLER: "Create User Controller initializing"
    },
    TASK_KEYS: [
        'title',
        'description',
        'priority',
        'dueDate',
        'taskComments'
    ],
    TASK_KEYS_AND_TYPES: [
        { title: "string" },
        { description: "string" },
        { priority: "string" },
        { dueDate: "string" },
        { taskComments: "array" }
    ],
    MESSAGE: 'message',
    NAME: 'name',
    UPDATED: 'updated',
    PRIORITY_LOW: "low",
    PRIORITY_HIGH: "high",
    PRIORITY_MEDIUM: "medium",
    ERROR: "Error",
    TASK_CREATED_SUCCESSFULLY: "Task Created Successfully",
    TASK_DATA: "taskData"
};
