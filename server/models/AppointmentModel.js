import mongoose from "mongoose";
import DentistModel from "./DentistModel.js";
import PatientModel from "./PatientModel.js";
import HospitalModel from "./HospitalModel.js";
// Create a schema for Appointment
const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Patient", // Reference to the Patient model
  },
  dentistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Dentist", // Reference to the Dentist model
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review", // Reference to the Dentist model
  },
  hospitalID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Hospital", // Reference to the Dentist model
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String, // Can store time in "HH:mm" format
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Appointment model
const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

export default AppointmentModel;
