"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
const readFile = (filePath) => {
    let fileData = fs_1.default.readFileSync(filePath, 'utf8');
    return fileData;
};
exports.readFile = readFile;
const writeFile = (filePath, data) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
exports.writeFile = writeFile;
