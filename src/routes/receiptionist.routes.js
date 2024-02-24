import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyReceptionist } from "../middlewares/receiptionist.middleware.js";
import { getAllAppointments, addAppointment } from "../controllers/receptionist.controller.js"

const router = Router();

router.route("/appointments").get(verifyJWT, getAllAppointments);
router.route("/addAppointment").post(verifyJWT, verifyReceptionist, addAppointment)

export default router;