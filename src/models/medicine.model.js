import mongoose, { Schema } from "mongoose"

const medicineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    }
}, { timeStamps: true })

export const Medicine = mongoose.model("Medicine", medicineSchema);