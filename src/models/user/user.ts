import mongoose from "mongoose";
import { userData } from "../../interface/userInterface";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    profileBio: {
        type: String,
        required: true
    },
    latestWorkDesignation: {
        type: String,
        required: true
    },
    certifications: {
        type: Array,
        required: true
    },
    yearsOfExperience: {
        type: String,
        required: true
    },
    bu: {
        type: String,
        required: true
    },
    workLocation: {
        type: String,
        required: true
    },
    employeeId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    approvalStatus: {
        type: String
    }
}, { timestamps: true })

// Create and export the models
const User = mongoose.model<userData>("User", userSchema);

export {User};