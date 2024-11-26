import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import Dentist from "../models/DentistModel.js";
import Patient from "../models/PatientModel.js";
import Admin from "../models/AdminModel.js";
import path from "path";
import multer from "multer";
import Hospital from "../models/HospitalModel.js";
import AvailabilityModel from "../models/AvailabilityModel.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import PatientModel from "../models/PatientModel.js";
import DentistModel from "../models/DentistModel.js";
import HospitalModel from "../models/HospitalModel.js";
import AppointmentModel from "../models/AppointmentModel.js";
dotenv.config();

export const dentistSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      clinical_address,
      clinic_name,
      city,
      designation,
      specialization,
      education,
      bds_no,
      fee,
    } = req.body;

    // Check if a file is uploaded
    const profile_img = req.file.path; // Cloudinary URL will be in req.file.path
    console.log(profile_img);
    // Check if email already exists
    const existingDentist = await Dentist.findOne({ email });
    if (existingDentist) {
      return res
        .status(400)
        .json({ message: "Dentist with this email already exists" });
    }

    // Create new dentist
    const newDentist = new Dentist({
      name,
      email,
      password, // Make sure to hash this before saving
      phone,
      designation,
      specialization,
      education,
      bds_no,
      fee,
      profile_img, // Store the image filename (or full path if required)
    });

    // Save to the database
    await newDentist.save();
    const newHospital = new Hospital({
      address: clinical_address,
      hospitalName: clinic_name,
      city: city,
      dentists: [newDentist._id],
    });
    await newHospital.save();
    newDentist.hospital.push(newHospital._id);
    await newDentist.save();
    const token = jwt.sign(
      { email: newDentist.email, id: newDentist._id, role: 1 },
      "scfbrb3wvfqdCWDCWDC",
      { expiresIn: "7d" }
    );
    res
      .status(201)
      .json({ message: "Dentist signed up successfully", dentist: newDentist });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "An error occurred during signup", error });
  }
};
// Route to set clinic timings
// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided." });

  jwt.verify(token, "scfbrb3wvfqdCWDCWDC", (err, decoded) => {
    if (err)
      return res.status(500).json({ error: "Failed to authenticate token." });
    req.userId = decoded.id; // Save the dentist's ID for use in the route
    next();
  });
};

//Route to updat epatient details
export const updatePatientDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get patient ID from params
    const updatedData = req.body; // Get updated data from the request body

    // Find the patient by ID and update their details
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );
    console.log(id);

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient details updated successfully",
      updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating patient details",
      error: error.message,
    });
  }
};
export const updateDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get doctor ID from params
    const updatedData = req.body; // Get updated data from the request body
    const profile_img = req.file.path; // Get the uploaded image filename

    // If profile_img is provided, include it in updatedData
    if (profile_img) {
      updatedData.profile_img = profile_img;
    }
    delete updatedData.hospital;
    delete updatedData.availability;

    const updatedDoctor = await DentistModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res
      .status(200)
      .json({ message: "Doctor details updated successfully", updatedDoctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating doctor details", error: error.message });
  }
};
// Route to set clinic timings
export const settimings = async (req, res) => {
  try {
    const { startTime, endTime, days } = req.body;

    if (!startTime || !endTime || !days) {
      return res.status(400).json({
        error: "Start time, end time, days, and hospitalId are required.",
      });
    }

    // Find the dentist by userId (from the token)
    const dentist = await Dentist.findById(req.userId);
    console.log("Requested Dentist ID:", req.userId); // Debug log

    if (!dentist) {
      return res.status(404).json({ error: "Dentist not found." });
    }
    // If dentist already has availability, delete the old one
    if (dentist.availability) {
      const oldAvailability = await AvailabilityModel.findById(
        dentist.availability
      );
      if (oldAvailability) {
        await AvailabilityModel.findByIdAndDelete(dentist.availability);
        console.log(`Deleted old availability for dentist ID: ${req.userId}`);
      }
    }
    // Create a new availability record
    const newAvailability = new AvailabilityModel({
      startTime,
      endTime,
      days,
    });
    await newAvailability.save();

    // Update the availability and dentist ID
    dentist.availability = newAvailability._id; // Reference availability
    await dentist.save();

    res.json({
      message: "Clinic timings and availability updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
};

export const patientSignup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });
    if (!phone) return res.status(400).json({ message: "Phone is required" });
    const userExists = await Patient.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newPatient = new Patient({ ...req.body, password: hashedPassword });

    await newPatient.save();
    const token = jwt.sign(
      { email: newPatient.email, id: newPatient._id, role: 0 },
      "scfbrb3wvfqdCWDCWDC",
      { expiresIn: "7d" }
    );
    res.status(201).json({ result: newPatient, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
//login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user in either Dentist or Patient collection
    const user =
      (await Dentist.findOne({ email }).populate("availability")) ||
      (await Patient.findOne({ email })) ||
      (await Admin.findOne({ email }));

    // If the user is not found, return an error
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      "scfbrb3wvfqdCWDCWDC",
      { expiresIn: "2d" }
    );
    // Determine the redirect path based on user role
    let dashboardRedirect;
    if (user.role === 1) {
      console.log("idL :", user._id);

      if (user.availability) {
        dashboardRedirect = "dentist/dashboard";
      } else {
        dashboardRedirect = "dentist/set-availability";
      }
    } else if (user.role === 0) {
      dashboardRedirect = "patient/dashboard"; // Role 0 for patients
    } else if (user.role === 3) {
      dashboardRedirect = "admin/dashboard"; // Role 3 for admins
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    // Send a success response with user role and redirection info
    res.status(200).json({
      message: "Login successful",
      role: user.role,
      id: user._id,
      token,
      redirect: dashboardRedirect,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
// Fetch all dentists
export const getAllDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find()
      .populate("availability")
      .populate("hospital"); // Populating hospital references

    res.status(200).json(dentists); // Return the dentists array
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getdentist = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const dentist = await Dentist.findById(doctorId)
      .populate("availability")
      .populate("hospital");
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    res.status(200).json(dentist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Fetch all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//fetch signle patient
export const getpatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    console.log("Fetching patient for ID:", patientId);
    const patient = await Patient.findById(patientId);
    if (!patient) {
      console.log("No patient found for ID:", patientId); // Log when no patient is found

      return res.status(404).json({ message: "patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user either in Dentist or Patient model
    let user =
      (await Dentist.findOne({ email })) || (await Patient.findOne({ email }));
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    // Create a JWT token that contains the OTP and expiration (valid for 10 minutes)
    const otpToken = jwt.sign({ otp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Send OTP via email (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use any SMTP service you prefer
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // Send the OTP token in response (this will be verified on the frontend later)
    return res.json({
      message: "OTP sent to your email.",
      otpToken, // Return the OTP token for frontend use
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP." });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp, otpToken, newPassword } = req.body;

  try {
    // Verify the JWT token (will check expiration as well)
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    console.log(req.body);
    // Check if the OTP matches
    if (decoded.otp === otp) {
      // User can reset their password now (implement the logic to reset the password)
      let user =
        (await Dentist.findOne({ email: req.body.email })) ||
        (await Patient.findOne({ email: req.body.email }));

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Hash the new password and save
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Password reset successfully." });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "OTP expired." });
    }
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }
};

// patientController.js

export const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await PatientModel.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// dentistController.js

export const deleteDentist = async (req, res) => {
  const { id } = req.params;
  try {
    const dentist = await DentistModel.findByIdAndDelete(id);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }
    res.status(200).json({ message: "Dentist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Function to fetch the total number of doctors, patients, and hospitals
export const getStats = async (req, res) => {
  try {
    // Fetch the total count of doctors
    const totalDoctors = await DentistModel.countDocuments();

    // Fetch the total count of patients
    const totalPatients = await PatientModel.countDocuments();

    // Fetch the total count of hospitals
    const totalHospitals = await HospitalModel.countDocuments();
    const totalAppointments = await AppointmentModel.countDocuments();
    // Return the stats
    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalHospitals,
        totalAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
};
