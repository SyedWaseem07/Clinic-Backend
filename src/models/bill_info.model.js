import mongoose, { Schema } from "mongoose"

const bill_infoSchema = new Schema({
    patient_name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
}, { timeStamps: true })

export const Bill_Info = mongoose.model("Bill_Info", bill_infoSchema);