"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = require("jsonWebToken");
const fileService_1 = require("../fileService/fileService");
const UserService = () => {
    const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const userName = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.username;
        const password = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password;
        const Password = hashPassword(password);
        let users = (0, fileService_1.readFile)('users.json');
        users = users && JSON.parse(users);
        // Check if username already exists
        const existingUser = getExistingUserData(userName, users);
        if (!existingUser) {
            // Add new user to the list
            users.push({ userName, password: Password });
            // Update the JSON file with the new user list
            (0, fileService_1.writeFile)('users.json', users);
            const user = { name: userName };
            const accessToken = generateAccessToken(user, "30m");
            res.json({ accessToken: accessToken });
        }
        else {
            res.end('user already exist');
        }
    });
    const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const saltRounds = yield bcrypt_1.default.genSalt(); // Adjust as needed for security
        const Password = yield bcrypt_1.default.hash(password, saltRounds);
        return Password;
    });
    const generateAccessToken = (data, expiresIn) => {
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
        return accessToken;
    };
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        const userName = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.username;
        const password = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.password;
        let users = (0, fileService_1.readFile)('users.json');
        users = users && JSON.parse(users);
        // Check if username already exists
        const existingUser = getExistingUserData(userName, users);
        if (existingUser) {
            bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password, (err, isMatch) => {
                if (err) {
                    res.end("Please verify the credentials");
                }
                else {
                    const user = { name: userName };
                    const accessToken = generateAccessToken(user, "30m");
                    res.json({ accessToken: accessToken });
                }
            });
        }
        else {
            res.end("user doesn't exist");
        }
    });
    const getExistingUserData = (userName, usersData) => {
        // Check if username already exists
        const existingUser = usersData && (usersData === null || usersData === void 0 ? void 0 : usersData.find((user) => user.userName === userName));
        return existingUser;
    };
    const verifyToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = decoded; // Attach decoded user data to request
            next();
        });
    };
    return { createUser, login, verifyToken };
};
exports.default = UserService;
