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
const buddyController_1 = __importDefault(require("./controllers/buddyController"));
const fileService_1 = __importDefault(require("./services/fileService"));
const express = require('express');
const { appConstants } = require('./constants/appConstants');
const app = express();
app.use(express.json());
const buddiesController = new buddyController_1.default();
const PORT = appConstants.PORT;
const fileName = appConstants.FILE_PATH;
const fileContent = appConstants.FILE_CONTENT;
const file = new fileService_1.default();
file.fileCreation(fileName, fileContent);
app.get('/buddies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield buddiesController.getBuddiesData(req, res);
}));
app.get('/buddy/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield buddiesController.getBuddyData(req, res);
}));
app.post('/buddy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield buddiesController.addBuddyDetails(req, res);
}));
app.put('/buddy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield buddiesController.updateBuddyDetails(req, res);
}));
app.listen(PORT);
