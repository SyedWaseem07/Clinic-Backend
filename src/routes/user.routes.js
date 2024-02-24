import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    getAllAppointments,
    getAllVisitedPatients,
    getSinglePatientDetails,
    getAllPaymentDetails
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/appointments").get(verifyJWT, getAllAppointments);
router.route("/allPatientDetails").get(verifyJWT, getAllVisitedPatients);

router.route("/allPayments").get(verifyJWT, getAllPaymentDetails);
router.route("/:patient_name").get(verifyJWT, getSinglePatientDetails);



export default router;