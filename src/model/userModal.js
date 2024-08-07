"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
const testSchema = new mongoose_1.default.Schema({
    testName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
// Create and export the models
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const Test = mongoose_1.default.model("Test", testSchema);
exports.Test = Test;
