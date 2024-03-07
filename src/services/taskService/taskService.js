"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const helper_1 = __importDefault(require("../../utils/helper"));
const TaskService = () => {
    const createTask = (req, res) => {
        var _a, _b, _c, _d, _e;
        const { title, description, priority, dueDate, taskComments } = req === null || req === void 0 ? void 0 : req.body;
        if (title && description && priority && dueDate && taskComments) {
            const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
            let tasks = fs_1.default.readFileSync('tasks.json', 'utf8');
            tasks = tasks && JSON.parse(tasks);
            // Check if username already exists
            const existingUser = tasks && (tasks === null || tasks === void 0 ? void 0 : tasks.find((user) => (user === null || user === void 0 ? void 0 : user.name) === name));
            const task = {
                id: existingUser ? ((_c = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks[((_b = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _b === void 0 ? void 0 : _b.length) - 1]) === null || _c === void 0 ? void 0 : _c.id) + 1 : 1,
                title: title,
                description: description,
                priority: priority,
                dueDate: dueDate,
                timeStamp: Date.now(),
                taskComments: taskComments
            };
            if ((0, helper_1.default)(dueDate)) {
                if (existingUser) {
                    for (let data of tasks) {
                        if ((data === null || data === void 0 ? void 0 : data.name) === name) {
                            (_d = data === null || data === void 0 ? void 0 : data.tasks) === null || _d === void 0 ? void 0 : _d.push(task);
                        }
                    }
                }
                else {
                    tasks.push({ name: name, tasks: [task] });
                }
                fs_1.default.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
                res.status(200).json({ message: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.name });
            }
            else {
                res.status(400).json({ error: 'Invalid Date' });
            }
        }
        else {
            res.status(400).json({ error: 'Invalid Request' });
        }
    };
    const fetchTask = (req, res) => {
        var _a, _b, _c, _d, _e, _f;
        const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
        const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
        const sortBy = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.sortBy;
        const filterParams = ["title", "priority", "dueDate"];
        const filterParam = Object.keys(req === null || req === void 0 ? void 0 : req.query)[0];
        const filterParamValue = req === null || req === void 0 ? void 0 : req.query[filterParam];
        let tasks = fs_1.default.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);
        const existingUser = tasks && (tasks === null || tasks === void 0 ? void 0 : tasks.find((user) => (user === null || user === void 0 ? void 0 : user.name) === name));
        if (sortBy) {
            tasks = (_d = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _d === void 0 ? void 0 : _d.sort((task1, task2) => {
                var _a;
                if (typeof (task1[sortBy]) === "string") {
                    return (_a = task1[sortBy]) === null || _a === void 0 ? void 0 : _a.localeCompare(task2[sortBy]);
                }
                else if (typeof (task1[sortBy] instanceof Date)) {
                    return task1[sortBy] - task2[sortBy];
                }
            });
        }
        else if (filterParamValue) {
            !filterParams.includes(filterParam) && res.status(400).json({ message: "Invalid params" });
            tasks = (_e = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _e === void 0 ? void 0 : _e.filter((task) => task[filterParam] === filterParamValue);
        }
        else {
            tasks = taskId ? (_f = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _f === void 0 ? void 0 : _f.filter((task) => (task === null || task === void 0 ? void 0 : task.id) === Number(taskId)) : existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks;
        }
        if (!tasks || !(tasks === null || tasks === void 0 ? void 0 : tasks.length) || !existingUser) {
            res.status(404).json({ message: "Tasks Not Found" });
        }
        else {
            res.status(200).json({ taskData: tasks });
        }
    };
    const updateTask = (req, res) => {
        var _a, _b, _c, _d;
        const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
        const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
        const updatedTasks = req === null || req === void 0 ? void 0 : req.body;
        const taskKeys = [
            'title',
            'description',
            'priority',
            'dueDate',
            'taskComments'
        ];
        !((_c = Object.keys(updatedTasks)) === null || _c === void 0 ? void 0 : _c.length) && res.status(400).json({ message: "Invalid Request" });
        for (let key of Object.keys(updatedTasks)) {
            !taskKeys.includes(key) && res.status(400).json({ message: "Invalid Request" });
        }
        let tasks = fs_1.default.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);
        const existingUser = tasks && (tasks === null || tasks === void 0 ? void 0 : tasks.find((user) => (user === null || user === void 0 ? void 0 : user.name) === name));
        const taskIndex = (_d = existingUser === null || existingUser === void 0 ? void 0 : existingUser.tasks) === null || _d === void 0 ? void 0 : _d.findIndex((task) => (task === null || task === void 0 ? void 0 : task.id) === Number(taskId));
        if (existingUser && taskIndex > 0) {
            for (let data of tasks) {
                if ((data === null || data === void 0 ? void 0 : data.name) === name) {
                    data.tasks[taskIndex] = Object.assign(Object.assign({}, data.tasks[taskIndex]), updatedTasks);
                    data.tasks[taskIndex].timeStamp = Date.now();
                }
            }
            fs_1.default.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
            res.status(200).json({ message: "updated" });
        }
        else {
            res.status(404).json({ message: "Tasks Not Found" });
        }
    };
    const deleteTask = (req, res) => {
        var _a, _b;
        const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
        const taskId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
        let isTaskAvailable = false;
        let tasks = fs_1.default.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);
        tasks = tasks === null || tasks === void 0 ? void 0 : tasks.map((task) => {
            var _a, _b;
            if ((task === null || task === void 0 ? void 0 : task.name) === name) {
                let taskList = (_a = task === null || task === void 0 ? void 0 : task.tasks) === null || _a === void 0 ? void 0 : _a.filter((task) => {
                    if ((task === null || task === void 0 ? void 0 : task.id) === Number(taskId)) {
                        isTaskAvailable = true;
                        return false;
                    }
                    else {
                        return true;
                    }
                });
                return {
                    name: name,
                    tasks: (_b = task === null || task === void 0 ? void 0 : task.tasks) === null || _b === void 0 ? void 0 : _b.filter((task) => (task === null || task === void 0 ? void 0 : task.id) !== Number(taskId))
                };
            }
            else {
                return task;
            }
        });
        if (isTaskAvailable) {
            fs_1.default.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
            res.status(200).json({ message: "deleted" });
        }
        else {
            res.status(404).json({ message: "Task Not Found" });
        }
    };
    const sortTask = (req, res) => {
        var _a;
        const name = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name;
        let tasks = fs_1.default.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);
        const existingUser = tasks && (tasks === null || tasks === void 0 ? void 0 : tasks.find((user) => (user === null || user === void 0 ? void 0 : user.name) === name));
        console.log(existingUser);
        res.end("heyy");
    };
    return { createTask, fetchTask, updateTask, deleteTask, sortTask };
};
exports.default = TaskService;
