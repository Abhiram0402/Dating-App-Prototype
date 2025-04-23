import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    requested_by_id: {
        type: String,
        required: true
    },
    requested_by_name: {
        type: String,
        required: true
    },
    requested_to_id: {
        type: String,
        required: true,
        index: true
    },
    requested_to_name: {
        type: String,
        required: true
    },
    requested_to_profile_pic_url: {
        type: String,
        required: true
    },
    request_status: {
        type: String,
        required: true
    }
},
    { timestamps: true });


const requestModel = mongoose.model("Request", requestSchema);

export default requestModel;