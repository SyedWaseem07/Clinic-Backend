import mongoose, { Schema } from "mongoose"

const medicineSchema = new Schema({
    patient_name: {
        type: String,
        required: true
    },
    medicine_name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    }
}, { timeStamps: true })

export const Medicine = mongoose.model("Medicine", medicineSchema);