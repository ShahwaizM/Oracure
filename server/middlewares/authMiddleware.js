import jwt from "jsonwebtoken";
import PatientModel from "../models/PatientModel.js"; // Adjust to your patient model path
import DentistModel from "../models/DentistModel.js"; // Adjust to your dentist model path
import AdminModel from "../models/AdminModel.js";

// Middleware to verify if the user is authenticated (JWT verification)
export const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "You need to be logged in." });
    }

    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, "scfbrb3wvfqdCWDCWDC");

    let user = null;

    // Check if the user is a patient or a dentist
    if (decoded.role === 0) {
      // If the user is a patient (role 0), find in PatientModel
      user = await PatientModel.findById(decoded.id);
    } else if (decoded.role === 1) {
      // If the user is a dentist (role 1), find in DentistModel
      user = await DentistModel.findById(decoded.id);
    } else if (decoded.role === 3) {
      // If the user is a dentist (role 1), find in DentistModel
      user = await AdminModel.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Attach the user object to the request for use in the route handler
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token.", error });
  }
};

// Middleware to check if the user is a doctor (dentist)
export const isDoctor = (req, res, next) => {
  if (req.user.role === 1) {
    // Assuming role 1 is for dentists
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied: Doctor role required." });
};

// Middleware to check if the user is a patient
export const isPatient = (req, res, next) => {
  console.log(req.user);
  if (req.user.role === 0) {
    // Assuming role 0 is for patients
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied: Patient role required." });
};

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user.role === 3) {
    // Assuming role 3 is for admin
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied: Admin role required." });
};
