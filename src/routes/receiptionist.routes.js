import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyReceptionist } from "../middlewares/receiptionist.middleware.js";
import { addAppointment, addPaymentDetails } from "../controllers/receptionist.controller.js"

const router = Router();


router.route("/addAppointment").post(verifyJWT, verifyReceptionist, addAppointment)
router.route("/addPaymentDetails").post(verifyJWT, verifyReceptionist, addPaymentDetails)


export default router;