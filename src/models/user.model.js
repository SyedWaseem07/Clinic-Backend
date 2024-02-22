import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
}, { timestamps: true })
 
export const User = mongoose.model("User", userSchema);