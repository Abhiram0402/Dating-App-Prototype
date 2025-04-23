import requestModel from "../models/requests.model.mjs";

export const requestForAccess = async (req, res) => {
    try {
        const { requested_to_id, requested_to_name, requested_to_profile_pic_url } = req.body;

        if (!requested_to_id || !requested_to_name || !requested_to_profile_pic_url) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRequest = new requestModel({
            requested_by_id: req.userDetails?._id,
            requested_by_name: req.userDetails?.user_name,
            requested_to_id,
            requested_to_name,
            requested_to_profile_pic_url,
            request_status: "PENDING",
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: "Request created successfully",
            data: savedRequest,
        });
    } catch (error) {
        console.error("Error creating request:", error);

        res.status(500).json({
            message: "An error occurred while creating the request",
            error: error.message,
        });
    }
};

export const listMyRequests = async (req, res) => {
    try {
        const listRequests = await requestModel.find({ requested_to_id: req.userDetails._id });

        if (!listRequests || listRequests.length === 0) {
            return res.status(404).json({ message: "No requests found!" });
        }

        res.status(200).json({ data: listRequests });
    } catch (error) {
        console.error("Error in listMyRequests function:", error);

        res.status(500).json({ message: "Internal server error!" });
    }
};

export const listSentRequests = async (req, res) => {
    try {
        const sentRequests = await requestModel.find({ requested_by_id: req.userDetails._id });

        if (!sentRequests || sentRequests.length === 0) {
            return res.status(404).json({ message: "No requests found!" });
        }

        res.status(200).json({ data: sentRequests });
    } catch (error) {
        console.error("Error in listSentRequests function:", error);

        res.status(500).json({ message: "Internal server error!" });
    }
};

export const takeActionOnProfiles = async (req, res) => {
    try {
        const { action } = req.body;
        const { request_id } = req.query;

        if (!["ACCEPTED", "REJECTED"].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Use ACCEPTED or REJECTED." });
        }

        const updatedRequest = await requestModel.findByIdAndUpdate(
            request_id,
            { request_status: action },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found!" });
        }

        res.status(200).json({
            message: `Request has been ${action.toLowerCase()}`,
            data: updatedRequest,
        });
    } catch (error) {
        console.error("Error in takeActionOnProfiles function:", error);

        res.status(500).json({ message: "Internal server error!", error: error.message });
    }
};
