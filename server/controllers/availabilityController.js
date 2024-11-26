import cron from "node-cron";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import DentistModel from "../models/DentistModel.js";
import AvailabilityModel from "../models/AvailabilityModel.js";

// Create a cron job that runs daily at a specific time
cron.schedule("0 0 * * *", async () => {
  try {
    const dentists = await DentistModel.find(); // Get all dentists
    for (const dentist of dentists) {
      // Call the method to update availability for each dentist
      await updateAvailability(dentist);
    }
    console.log("Availability updated for all dentists.");
  } catch (error) {
    console.error("Error updating availability:", error);
  }
});

const updateAvailability = async (dentist) => {
  const oldAvailability = await AvailabilityModel.findById(
    dentist.availability._id
  );

  if (!oldAvailability) {
    console.warn(
      `No previous availability found for dentist ID: ${dentist._id}`
    );
    return;
  }

  const now = new Date();

  // Remove dates that have passed
  oldAvailability.availableDates = oldAvailability.availableDates.filter(
    (entry) => new Date(entry.date) >= now
  );

  // Generate new available dates based on old availability
  const availableDates = getNextNDatesForDays(oldAvailability.days, 4);
  const newSlots = availableDates.map((date) => ({
    date: date,
    timeSlots: generateTimeSlots(
      oldAvailability.startTime,
      oldAvailability.endTime
    ),
  }));

  // Combine old and new availability, ensuring valid entries
  oldAvailability.availableDates = [
    ...oldAvailability.availableDates,
    ...newSlots,
  ].filter((slot) => slot.date && slot.timeSlots.length > 0); // Ensures valid dates and time slots are added

  // Save the updated availability
  await oldAvailability.save();
  console.log(`Updated availability for dentist ID: ${dentist._id}`);
};

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
const getNextNDatesForDays = (daysOfWeek, weeksToGenerate = 4) => {
  const daysOfWeekMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
  };

  const currentDate = new Date();
  const generatedDates = [];

  for (let week = 0; week < weeksToGenerate; week++) {
    daysOfWeek.forEach((day) => {
      const dayIndex = daysOfWeekMap[day];
      const resultDate = new Date(currentDate);

      // Calculate how many days until the next target day
      let daysUntilNext = (dayIndex - resultDate.getDay() + 7) % 7;

      // If today is the same day as the target day, we should add 7 days to get to the next week
      if (daysUntilNext === 0) {
        daysUntilNext += 7;
      }

      resultDate.setDate(resultDate.getDate() + daysUntilNext + week * 7);
      generatedDates.push(resultDate);
    });
  }

  return generatedDates;
};
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (currentTime < end) {
    const nextSlot = new Date(currentTime);
    nextSlot.setMinutes(nextSlot.getMinutes() + 30);

    slots.push(
      `${currentTime.toTimeString().slice(0, 5)} - ${nextSlot
        .toTimeString()
        .slice(0, 5)}`
    );

    currentTime = nextSlot;
  }

  return slots;
};

export const setAvailability = async (req, res) => {
  try {
    const { days, startTime, endTime } = req.body;
    if (!startTime || !endTime || !days) {
      return res.status(400).json({
        error: "Start time, end time, and days are required.",
      });
    }

    const dentist = await DentistModel.findById(req.userId);
    if (!dentist) {
      return res.status(404).json({ error: "Dentist not found." });
    }

    // If dentist already has availability, delete the old one
    if (dentist.availability) {
      await AvailabilityModel.findByIdAndDelete(dentist.availability);
    }

    const availableDates = getNextNDatesForDays(days, 4); // Generate for 4 weeks
    const availabilityWithSlots = availableDates.map((date) => ({
      date: date,
      timeSlots: generateTimeSlots(startTime, endTime),
    }));

    // Save availability to the database with days and timings
    const newAvailability = new AvailabilityModel({
      dentistId: dentist._id, // Store the dentist's ID
      availableDates: availabilityWithSlots,
      days: days,
      startTime: startTime,
      endTime: endTime,
    });

    await newAvailability.save();

    // Update the dentist's availability reference
    dentist.availability = newAvailability._id;
    await dentist.save();

    res.json({
      message: "Clinic timings and availability updated successfully.",
    });
  } catch (error) {
    console.error("Error setting availability:", error);
    res.status(500).json({
      success: false,
      message: "Error setting availability",
      error: error.message,
    });
  }
};
