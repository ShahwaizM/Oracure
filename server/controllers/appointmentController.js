import express from "express";
import Dentist from "../models/DentistModel.js";
import PatientModel from "../models/PatientModel.js";
import AvailabilityModel from "../models/AvailabilityModel.js";
import AppointmentModel from "../models/AppointmentModel.js";
import dotenv from "dotenv";
const router = express.Router();
// Set up NodeMailer transporter
import nodemailer from "nodemailer";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use host and port instead

  auth: {
    user: "shahwaizmughal02@gmail.com", // Your email address
    pass: process.env.PASS,
    // Your email password or app password
  },
});
console.log("pass: ", process.env.PASS);
// Route to book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const doctorId = req.params.id; // Dentist ID from URL parameters
    const { selectedDay, selectedTime } = req.body; // Include patientId for appointment creation
    const patientId = req.userId; // Extract patient ID from decoded token
    // Find the dentist by their ID and populate the availability
    const dentist = await Dentist.findById(doctorId)
      .populate("availability")
      .populate("hospital");
    if (!dentist || !dentist.availability) {
      return res
        .status(404)
        .json({ error: "Dentist or availability not found." });
    }
    if (dentist) {
      const hospitalDetails = dentist.hospital; // Access populated hospital details
      const hospitalId = dentist.hospital[0]._id; // Access hospital ID
    } else {
      console.log("Dentist not found");
    }

    console.log(dentist.availability);
    console.log("selected date: ", new Date(selectedDay).toDateString());
    // Find the specific date in availableDates
    const availability = dentist.availability.availableDates.find(
      (date) =>
        date.date.toDateString() === new Date(selectedDay).toDateString()
    );
    console.log(availability);
    if (!availability) {
      return res.status(404).json({ error: "Selected day is not available." });
    }

    // Check if the selected time is available
    const timeIndex = availability.timeSlots.indexOf(selectedTime);
    if (timeIndex === -1) {
      return res.status(400).json({ error: "Selected time is not available." });
    }

    // Remove the selected time from the time slots
    availability.timeSlots.splice(timeIndex, 1);

    // Update the dentist's availability
    await dentist.availability.save();
    const hospitalId = dentist.hospital[0]._id; // Access hospital ID
    console.log("Pid: ", patientId);
    // Create a new appointment
    const newAppointment = new AppointmentModel({
      patientId, // Patient ID
      hospitalID: hospitalId,
      dentistId: doctorId,
      appointmentDate: selectedDay,
      appointmentTime: selectedTime,
    });

    await newAppointment.save();
    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    const ma = patient.email;
    const formattedDate = new Date(selectedDay).toLocaleDateString("en-US");

    const message =
      "Appointment Booked succesfully on " +
      formattedDate +
      " at " +
      selectedTime.toString() +
      " with Dr " +
      dentist.name;
    console.log(message);
    transporter.sendMail(
      {
        from: "shahwaizmughal02@gmail.com",
        to: ma,
        subject: "Appointment booking!",
        text: message,
      },
      (error, info) => {
        if (error) {
          return console.log("Error:", error);
        }
        console.log("Email sent:", info.response);
      }
    );
    res.status(200).json({ message: "Appointment booked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};

// Fetch all appointments with populated fields
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate({
        path: "dentistId",
        select: "name email", // Only return name and email of the dentist
      })
      .populate({
        path: "patientId",
        select: "name email", // Only return name and email of the patient
      })
      .populate({
        path: "hospitalID",
        select: "hospitalName address", // Only return hospital name and address
      });
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Controller function to get all appointments for a patient

export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user._id; // Assuming the patient is logged in and we have their ID from the token
    console.log("Patient ID:", patientId);

    // Find all appointments where the patientId matches the logged-in patient's ID
    const appointments = await AppointmentModel.find({ patientId })
      .populate("dentistId") // Use the key name for the dentist reference
      .populate("hospitalID"); // Use the key name for the hospital reference

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error retrieving appointments:", error); // Log the error
    return res
      .status(500)
      .json({ message: "Error retrieving appointments", error: error.message }); // Send the error message in the response
  }
};

// Controller function to get all appointments for a doctor

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id; // Assuming the doctor is logged in and we have their ID from the token
    console.log("Doctor ID:", doctorId);

    // Find all appointments where the dentistId matches the logged-in doctor's ID
    const appointments = await AppointmentModel.find({ dentistId: doctorId }) // Use dentistId instead of doctorId
      .populate("patientId") // Populate patient details, if needed
      .populate("hospitalID"); // Populate hospital details, if needed

    console.log("Appointments found:", appointments);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error retrieving appointments:", error); // Log the error
    return res
      .status(500)
      .json({ message: "Error retrieving appointments", error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("patientId") // Populate patient details, if needed
      .populate("dentistId") // Populate patient details, if needed
      .populate("hospitalID"); // Populate hospital details, if needed;

    console.log(req.user._id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.status = "Cancelled"; // Update the status of the appointment
    await appointment.save();
    console.log("davss: ", appointment.dentistId.availability._id);
    // Find the dentist's availability
    const dentistAvailability = await AvailabilityModel.findById(
      appointment.dentistId.availability._id
    );
    console.log(dentistAvailability);
    if (!dentistAvailability) {
      return res
        .status(404)
        .json({ message: "Availability not found for the dentist" });
    }

    const appointmentDate = appointment.appointmentDate;
    const appointmentTime = appointment.appointmentTime;

    // Find the correct date in the availability and add the time slot back
    const availableDate = dentistAvailability.availableDates.find(
      (availableDate) =>
        availableDate.date.toDateString() ===
        new Date(appointmentDate).toDateString()
    );

    if (availableDate) {
      // If the date exists, check if the time slot already exists to avoid duplicates
      if (!availableDate.timeSlots.includes(appointmentTime)) {
        availableDate.timeSlots.push(appointmentTime); // Add the time slot back
      }
    } else {
      // If the date doesn't exist, create a new entry for that date
      dentistAvailability.availableDates.push({
        date: new Date(appointmentDate),
        timeSlots: [appointmentTime],
      });
    }

    // Save the updated availability
    await dentistAvailability.save();

    res.json({
      message:
        "Appointment cancelled successfully, slot added back to availability.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const completeAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("patientId") // Populate patient details, if needed
      .populate("hospitalID"); // Populate hospital details, if needed;
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.dentistId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.status = "Completed"; // Mark as complete
    await appointment.save();

    res.json({ message: "Appointment marked as complete" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//fetch appointment details
export const getAppointment = async (req, res) => {
  try {
    const AppointmentId = req.params.id;
    console.log("Fetching Appointment for ID:", AppointmentId);
    const Appointment = await AppointmentModel.findById(AppointmentId)
      .populate("hospitalID")
      .populate("dentistId");
    if (!Appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(Appointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Controller to get appointment statistics
export const getAppointmentStats = async (req, res) => {
  const dentistId = req.params.dentistId;

  try {
    const completedCount = await AppointmentModel.countDocuments({
      dentistId: dentistId,
      status: "Completed", // Assuming you have a status field
    });

    const pendingCount = await AppointmentModel.countDocuments({
      dentistId: dentistId,
      status: "Pending", // Assuming you have a status field
    });

    // Send the stats as a response
    res.json({
      completed: completedCount,
      pending: pendingCount,
    });
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default router;
