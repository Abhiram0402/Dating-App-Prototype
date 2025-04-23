import mongoose, { mongo, Mongoose, trusted } from "mongoose";

const postSchema = new mongoose.Schema({
    post_url: {
        type: String,
        required: true
    },
    posted_by: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true })

const postModel = mongoose.model("Post", postSchema);

export default postModel;