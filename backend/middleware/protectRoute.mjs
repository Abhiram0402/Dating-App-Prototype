import jwt from 'jsonwebtoken';
import { user } from '../models/user.model.mjs';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ Error: "Unauthorized. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT);
        // console.log("decoded-->", decoded);
        if (!decoded) {
            return res.status(401).json({ Error: "Unauthorized. Invalid token." });
        }

        const userDetails = await user.findById(decoded.user_id).select("-password");
        // console.log("user details", userDetails)
        if (!userDetails) {
            return res.status(404).json({ Error: "User not found." });
        }

        req.userDetails = userDetails;
        next();
    } catch (error) {
        console.error("Error in protect route", error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
};
