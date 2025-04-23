import postModel from "../models/post.model.mjs";
import { user } from "../models/user.model.mjs";

export const createPost = async (req, res) => {
    try {
        const { post_url, description } = req.body;
        if (!post_url) {
            res.status(400).json({ Error: "Missing mandatory fields." })
        }
        const newPost = new postModel({
            post_url,
            description,
            posted_by: req.userDetails._id
        });

        const insertIntoDb = await newPost.save();
        if (!insertIntoDb) {
            res.status(400).json({ Error: "Error in inserting to MongoDB" });
        }
        const updateCounter = await user.findByIdAndUpdate(
            req.userDetails._id,
            { $inc: { no_of_posts: 1 } },
            { new: true }
        );
        return res.status(201).json({ message: "Created post successfully." })
    } catch (error) {
        console.error("Error creating post:", error.message);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
}

export const listMyPosts = async (req, res) => {
    try {
        const listMyPostsParams = await postModel.find({ posted_by: req.userDetails._id });
        if (!listMyPostsParams) {
            return res.status(404).json({ error: "No posts found for this user" });
        }
        return res.status(200).json({ message: "Content retrieved successfully", content: listMyPostsParams });
    } catch (error) {
        console.error("Error listing user content:", error.message);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
}

export const editPost = async (req, res) => {
    try {
        const { description } = req.body;
        const { post_id } = req.query;

        if (!post_id) {
            return res.status(400).json({ error: "Missing post_id in query string" });
        }

        const postToEdit = await postModel.findOne({ _id: post_id, posted_by: req.userDetails._id });
        if (!postToEdit) {
            return res.status(404).json({ error: "Post not found or you are not authorized to edit this post" });
        }

        postToEdit.description = description || postToEdit.description;
        const updatedPost = await postToEdit.save();

        return res.status(200).json({ message: "Post updated successfully", updatedPost });
    } catch (error) {
        console.error("Error editing post:", error.message);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { post_id } = req.query;

        if (!post_id) {
            return res.status(400).json({ error: "Missing post_id in query string" });
        }

        const postToDelete = await postModel.findOne({ _id: post_id, posted_by: req.userDetails._id });
        if (!postToDelete) {
            return res.status(404).json({ error: "Post not found or you are not authorized to delete this post" });
        }

        await postModel.deleteOne({ _id: post_id });

        await user.findByIdAndUpdate(req.userDetails._id, { $inc: { no_of_posts: -1 } });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
};

export const listInterests = async (req, res) => {
    try {
        const { minAge = 18, maxAge = 60 } = req.query;
        const currentUser = req.userDetails;

        if (!currentUser) {
            return res.status(401).json({ error: "Unauthorized: No user details found" });
        }

        const oppositeGender = currentUser.gender === "male" ? "female" : "male";

        const interests = await user.find({
            gender: oppositeGender,
            user_age: { $gte: minAge, $lte: maxAge }
        })
            .select("-password")
            .sort({ user_age: 1 });

        res.status(200).json({
            message: "Interests fetched successfully",
            interests,
        });
    } catch (error) {
        console.error("Error fetching interests:", error.message);
        res.status(500).json({ error: "Server error, please try again later." });
    }
};

