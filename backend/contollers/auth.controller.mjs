import { user } from "../models/user.model.mjs";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndCookie.mjs";

export const signup = async (req, res) => {
    try {
        const { user_email_id, user_name, user_age, password, profile_pic_url, gender } = req.body;

        if (!user_email_id || !user_name || !user_age || !password || !profile_pic_url || !gender) {
            return res.status(400).json({ Error: "Missing mandatory fields!" });
        }

        if (user_age > 60 || user_age < 18) {
            return res.status(400).json({ Error: "Sorry, your age does not permit to allow you here." });
        }

        const userDetails = await user.findOne({ user_email_id });
        if (userDetails) {
            return res.status(400).json({ Error: "User already exists. Kindly login!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({
            user_email_id,
            user_name,
            user_age,
            profile_pic_url,
            gender,
            password: hashedPassword,
            no_of_posts: 0
        });

        const insertedUser = await newUser.save();
        if (!insertedUser) {
            return res.status(400).json({ Error: "Error in inserting to MongoDB" });
        }

        return res.status(200).json({ Message: "Signup successful!" });

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        return res.status(500).json({ Error: "Server error, please try again later." });
    }
};


export const login = async (req, res) => {
    try {
        const { user_email_id, password } = req.body;

        if (!user_email_id || !password) {
            return res.status(400).json({ Error: "Email and password are required!" });
        }

        const userDetails = await user.findOne({ user_email_id });
        console.log("user details--->", userDetails)
        if (!userDetails) {
            return res.status(404).json({ Error: "Kindly signup before login." });
        }

        const verifyPassword = await bcrypt.compare(password, userDetails.password);
        if (!verifyPassword) {
            return res.status(400).json({ Error: "Incorrect password!" });
        }

        await generateTokenAndSetCookie(userDetails._id, res);

        return res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        console.error("Error in login controller", error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
};



export const logout = async (req, res) => {
    res.cookie("jwt", '', 0);
    res.status(200).json({ message: "Logged out successfully!" })
}