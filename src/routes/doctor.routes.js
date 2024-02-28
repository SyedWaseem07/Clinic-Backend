import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyDoctor } from "../middlewares/doctor.middleware.js";
import {
    dailyWeeklyMonthlyPatientCount,
    dailyWeeklyMonthlyRevenue
} from "../controllers/doctor.controller.js"

const router = Router();
router.route("/patientCountInfo").get(verifyJWT, verifyDoctor, dailyWeeklyMonthlyPatientCount);

router.route("/revenueInfo").get(verifyJWT, verifyDoctor, dailyWeeklyMonthlyRevenue);

export default router;