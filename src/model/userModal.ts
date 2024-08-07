import { required } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const testSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

// Create and export the models
const User = mongoose.model("User", userSchema);
const Test = mongoose.model("Test", testSchema);

export { User, Test };