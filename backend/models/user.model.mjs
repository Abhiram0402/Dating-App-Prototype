import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_email_id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    user_name: {
        type: String,
        required: true
    },
    user_age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    no_of_posts: {
        type: Number,
        required: false
    }
},
    { timestamps: true });

export const user = mongoose.model("User", userSchema);

