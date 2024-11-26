import express from "express";
import {
  dentistSignup,
  upload,
  getAllDentists,
  getAllPatients,
  login,
  patientSignup,
  settimings,
  verifyToken,
  getdentist,
  verifyOTP,
  forgotPassword,
  updateDoctorDetails,
  updatePatientDetails,
  getpatient,
  deleteDentist,
  deletePatient,
  getStats,
} from "../controllers/authControllers.js";
import formidable from "express-formidable";
import {
  getDoctorAppointments,
  getPatientAppointments,
  bookAppointment,
  completeAppointment,
  cancelAppointment,
  getAppointment,
  getAllAppointments,
  getAppointmentStats,
} from "../controllers/appointmentController.js";
import {
  isAdmin,
  isAuthenticated,
  isDoctor,
  isPatient,
} from "../middlewares/authMiddleware.js"; // Example middlewares

import { setAvailability } from "../controllers/availabilityController.js";
import { addreview, getreview } from "../controllers/reviewController.js";
import { getHospital } from "../controllers/HospitalController.js";
const router = express.Router();

// Signup Route
router.post("/dsignup", upload.single("profile_img"), dentistSignup);
router.post("/set-clinic-timing", verifyToken, settimings);

router.post("/signup", patientSignup);
// Login Route
router.post("/login", login);
// Update Patient Details
router.put("/patients/:id", updatePatientDetails);

// Update Doctor Details
router.put("/doctors/:id", upload.single("profile_img"), updateDoctorDetails);

router.post("/forgot-password", forgotPassword); // Request OTP route
router.post("/verify-otp", verifyOTP); // Verify OTP and reset password route

// Route to fetch all dentists
router.get("/dentists", getAllDentists);

//Route to fetch single dentist
router.get("/getDentist/:id", getdentist);
router.post("/appointmentbooking/:id", verifyToken, bookAppointment);
router.post("/setAvailability", verifyToken, setAvailability);

// Route to fetch all patients
router.get("/patients", getAllPatients);
//route to fetch single patient
router.get("/getPatients/:id", getpatient);

// Routes for appointments
router.get("/appointmentStats/:dentistId", getAppointmentStats);

// Doctor route: Get all appointments for the logged-in doctor
router.get(
  "/doctor-appointments",
  isAuthenticated,
  isDoctor,
  getDoctorAppointments
);

// Patient route: Get all appointments for the logged-in patient
router.get(
  "/patient-appointments",
  isAuthenticated,
  isPatient,
  getPatientAppointments
);
router.get("/ap", getAllAppointments);
router.get("/getAPdetails/:id", getAppointment);
router.post("/markComplete", isAuthenticated, isDoctor, completeAppointment);
router.post(
  "/cancelAppointment",
  isAuthenticated,
  isPatient,
  cancelAppointment
);
router.post("/appointment/:appointmentId/review", isAuthenticated, addreview);
router.get("/dentist/:dentistId/reviews", getreview);
// Admin can delete a patient
router.delete("/deletePatient/:id", deletePatient);

// Admin can delete a dentist
router.delete("/deleteDentist/:id", deleteDentist);
router.get("/stats", getStats);
router.get("/hospitals", getHospital);
//protected Admin route auth
router.get("/admin-auth", isAuthenticated, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected User route auth
router.get("/dentist-auth", isAuthenticated, isDoctor, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Patient route auth
router.get("/patient-auth", isAuthenticated, isPatient, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
