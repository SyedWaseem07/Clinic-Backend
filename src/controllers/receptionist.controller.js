import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Appointment } from "../models/appointment.model.js"
import { Visited_Patient_Details } from "../models/visited_patient_details.model.js"
import { Bill_Info } from "../models/bill_info.model.js"

// add appointment
// Post :- /api/v1/users/receptionist/addAppointment
const addAppointment = asyncHandler( async (req, res) => {
    const { patient_name, mobile_no, age, gender, date_of_app, time_of_app} = req.body;
    if(!patient_name || !mobile_no || !age || !gender || !date_of_app || !time_of_app)
        throw new ApiError(400, "All feilds are required");
    
    const existingApp = await Appointment.findOne({
        $and: [{ patient_name }, { date_of_app }, { time_of_app }]
    })

    if(existingApp) throw new ApiError(400, "Appointment already booked");

    const appointment = await Appointment.create({
        patient_name, mobile_no, age, gender, date_of_app, time_of_app
    })

    const bookedApp = await Appointment.findOne({
        $and: [{ patient_name }, { date_of_app }, { time_of_app }]
    })

    if(!bookedApp) throw new ApiError(500, "Unable to book appointment");

    return res.status(201).json(new ApiResponse(200, bookedApp, "Appointment booked successfully"));
} )

// add patient details


// add bill info
// Get :- /api/v1/users/receptionist/addPaymentDetails
const addPaymentDetails = asyncHandler( async (req, res) => {
    const { patient_name, amount, date } = req.body;
    if(!patient_name || !amount || !date) 
        throw new ApiError(400, "All feilds are required");
    
    const paymentDetails = await Bill_Info.create({
        patient_name, amount, date
    })

    if(!paymentDetails) throw new ApiError(500, "Unable to store payment details");

    return res.status(201).json(new ApiResponse(200, paymentDetails, "Payment Deatils added successfully"));
} )

export {
    addAppointment,
    addPaymentDetails
}