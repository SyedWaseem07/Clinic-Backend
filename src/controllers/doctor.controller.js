import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Visited_Patient_Details } from "../models/visited_patient_details.model.js"
import { Bill_Info } from "../models/bill_info.model.js"
// get daily patient count
// Get:- /api/v1/users/doctor/dailyPatientCountAndRevenue
const dailyWeeklyMonthlyPatientCount  = asyncHandler( async (req, res) => {
    let currentDate = new Date();
    let previousDate = new Date(currentDate - 24 * 60 * 60 * 1000);
    const dailyPatientsInfo = await Visited_Patient_Details.find({
        last_visited: {
            $gte: previousDate,
            $lte: currentDate
        }
    })

    currentDate = new Date();
    previousDate = new Date(currentDate - 6 * 24 * 60 * 60 * 1000);

    const weeklyPatientsInfo = await Visited_Patient_Details.find({
        last_visited: {
            $gte: previousDate,
            $lte: currentDate
        }
    })
currentDate = new Date();
if(currentDate.getMonth() + 1 === 1 || currentDate.getMonth() + 1 === 3 || currentDate.getMonth() + 1 === 5 || currentDate.getMonth() + 1 === 7 || currentDate.getMonth() + 1 === 8 || currentDate.getMonth() + 1 === 10 || currentDate.getMonth() + 1 === 12) 
       previousDate = new Date(currentDate -  30 * 24 * 60 * 60 * 1000);

    else if(currentDate.getMonth() + 1 === 4 || currentDate.getMonth() + 1 === 6 || currentDate.getMonth() + 1 === 8 || currentDate.getMonth() + 1 === 11 )
    previousDate = new Date(currentDate -  29 * 24 * 60 * 60 * 1000);

    else {
        if(currentDate.getFullYear() % 4 === 0) previousDate = new Date(currentDate -  28 * 24 * 60 * 60 * 1000);
        else previousDate = new Date(currentDate -  27 * 24 * 60 * 60 * 1000);
    }

    const monthlyPatientsInfo = await Visited_Patient_Details.find({
        last_visited: {
            $gte: previousDate,
            $lte: currentDate
        }
    })
const dailyPatientCount = dailyPatientsInfo.length
const weeklyPatientCount = weeklyPatientsInfo.length
const monthlyPatientCount = monthlyPatientsInfo.length

    return res.status(200).json(new ApiResponse(200, {dailyPatientCount, weeklyPatientCount, monthlyPatientCount}, "Daily, Weekly and monthly patient countfetched sucessfully"))
} ) 

const dailyWeeklyMonthlyRevenue = asyncHandler( async (req, res) => {
    let currentDate = new Date();
    let previousDate = new Date(currentDate - 24 * 60 * 60 * 1000);
    const dailyRevenueInfo = await Bill_Info.find({
        createdAt: {
            $gte: previousDate,
            $lte: currentDate
        }
    })

    currentDate = new Date();
    previousDate = new Date(currentDate - 6 * 24 * 60 * 60 * 1000);

    const weeklyRevenueInfo = await Bill_Info.find({
        createdAt: {
            $gte: previousDate,
            $lte: currentDate
        }
    })

    
currentDate = new Date();
if(currentDate.getMonth() + 1 === 1 || currentDate.getMonth() + 1 === 3 || currentDate.getMonth() + 1 === 5 || currentDate.getMonth() + 1 === 7 || currentDate.getMonth() + 1 === 8 || currentDate.getMonth() + 1 === 10 || currentDate.getMonth() + 1 === 12) 
       previousDate = new Date(currentDate -  30 * 24 * 60 * 60 * 1000);

    else if(currentDate.getMonth() + 1 === 4 || currentDate.getMonth() + 1 === 6 || currentDate.getMonth() + 1 === 8 || currentDate.getMonth() + 1 === 11 )
    previousDate = new Date(currentDate -  29 * 24 * 60 * 60 * 1000);

    else {
        if(currentDate.getFullYear() % 4 === 0) previousDate = new Date(currentDate -  28 * 24 * 60 * 60 * 1000);
        else previousDate = new Date(currentDate -  27 * 24 * 60 * 60 * 1000);
    }

    const monthlyRevenueInfo = await Bill_Info.find({
        createdAt: {
            $gte: previousDate,
            $lte: currentDate
        }
    })
    
    let dailyRevenue = 0;
    for(let i = 0; i < dailyRevenueInfo.length; ++i) 
        dailyRevenue += dailyRevenueInfo[i].amount;

    let weeklyRevenue = 0;
    for(let i = 0; i < weeklyRevenueInfo.length; ++i) 
    weeklyRevenue +=   weeklyRevenueInfo[i].amount;

    let monthlyRevenue = 0;
    for(let i = 0; i < monthlyRevenueInfo.length; ++i) 
    monthlyRevenue += monthlyRevenueInfo[i].amount;

     
    return res.status(200).json(new ApiResponse(200, {dailyRevenue, weeklyRevenue, monthlyRevenue}, "Daily, Weekly and monthly patient count fetched sucessfully"))
} ) 
export {
    dailyWeeklyMonthlyPatientCount,
    dailyWeeklyMonthlyRevenue
}