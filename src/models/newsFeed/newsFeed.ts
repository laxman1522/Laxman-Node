import mongoose from "mongoose";
import { newsFeed } from "../../interface/newsFeed";


const feedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    currentTime: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: String,
        required: true
    },
    likes: {
        type: Number
    },
    comments: {
        type: Array<Object>
    },
    likedBy: {
        type: Array<String>
    }
})

const Feed = mongoose.model<newsFeed>('feed',feedSchema);

export {Feed};