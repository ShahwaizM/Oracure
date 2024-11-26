import express from "express";
import AppointmentModel from "../models/AppointmentModel.js";
import ReviewModel from "../models/ReviewModel.js";
// Route to add a review to an appointment
export const addreview = async (req, res) => {
  try {
    const { stars, title, comment } = req.body;
    const appointmentId = req.params.appointmentId;
    const userId = req.userId; // Assuming userId is stored in the token after authentication (patient ID)

    console.log("id: ", appointmentId);
    // Find the appointment by ID
    const appointment = await AppointmentModel.findById(appointmentId);
    console.log(appointment);
    // Ensure the appointment exists and the user adding the review is the patient
    console.log("ap: ", String(appointment.patientId._id));
    console.log("us: ", String(userId));

    // Ensure the appointment is completed before adding a review
    if (appointment.status !== "Completed") {
      return res
        .status(400)
        .json({ error: "You can only review completed appointments." });
    }

    // Check if the review has already been given
    if (appointment.review) {
      return res
        .status(400)
        .json({ error: "Review already given for this appointment." });
    }

    // Create a new review
    const newReview = new ReviewModel({
      given: true,
      stars,
      title,
      comment,
    });

    // Save the review
    await newReview.save();

    // Update the appointment with the review ID
    appointment.review = newReview._id;
    await appointment.save();

    res.json({ message: "Review added successfully.", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Server error." });
  }
};
// Route to fetch reviews for a specific dentist
export const getreview = async (req, res) => {
  try {
    const dentistId = req.params.dentistId;

    // Find all appointments related to the dentist that have a review
    const appointmentsWithReviews = await AppointmentModel.find({
      dentistId,
      review: { $exists: true },
    })
      .populate("review") // Populate review data
      .populate("patientId", "name"); // Populate patient data (only name)

    // Extract the reviews and patient names from the appointments
    const reviews = appointmentsWithReviews.map((appointment) => ({
      review: appointment.review,
      patientName: appointment.patientId.name, // Get patient's name
    }));

    res.json({ dentistId, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error." });
  }
};
