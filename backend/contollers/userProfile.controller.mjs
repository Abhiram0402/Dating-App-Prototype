import { user } from "../models/user.model.mjs";

export const getCurrentUser = async (req, res) => {
    try {
        if (req.userDetails) {
            return res.status(200).json({ userDetails: req.userDetails });
        } else {
            return res.status(404).json({ Error: "User not found or not authenticated." });
        }
    } catch (error) {
        console.error("Unexpected error in get current user", error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
};

export const editProfile = async (req, res) => {
    try {
        console.log("Req------>", req.userDetails);
        const { user_name, user_age, profile_pic_url } = req.body;
        const updateDetails = await user.findByIdAndUpdate(
            req.userDetails._id,
            { user_name, user_age, profile_pic_url },
            { new: true, runValidators: true }
        ).select("-password");
        if (!updateDetails) {
            return res.status(404).json({ Error: "User not found!" });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: updateDetails
        });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const deleteUserAccount = await user.findByIdAndDelete(req.userDetails._id);
        if (!deleteUserAccount) {
            return res.status(404).json({ error: "User not found. Unable to delete the account." });
        }
        res.cookie("jwt", "", 0);
        res.status(200).json({ message: "Account deleted successfully!" });
    } catch (error) {
        console.error("Error in delete account", error);
    }
}