import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Appointment } from "../models/appointment.model.js"

// get all appointments
const getAllAppointments = asyncHandler( async (req, res) => {
    const appointments = await Appointment.find();
    return res.status(200).json(new ApiResponse(200, appointments, "All Appointments fetched successfully"))
} )

// add appointment
// Post :- /api/v1/users/receptionist/addAppointment
const addAppointment = asyncHandler( async (req, res) => {
    const { patient_name, mobile_no, age, gender, date_of_app, time_of_app} = req.body;
    if(!patient_name || !mobile_no || !age || !gender || !date_of_app || !time_of_app)
        throw new ApiError(400, "All feilds are required");
    
    const existingApp = await Appointment.findOne({
        $and: [{ patient_name }, { date_of_app }, { time_of_app }]
    })

    console.log(existingApp)
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
// get all patients
// add bill info
// get all bill info

export {
    getAllAppointments,
    addAppointment
}