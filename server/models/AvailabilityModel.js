import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  dentistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DentistModel",
    required: true,
  },
  days: {
    type: [String], // Array of strings to store days of the week
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  availableDates: [
    {
      date: {
        type: Date,
        required: true,
      },
      timeSlots: [
        {
          type: String, // e.g., '13:00 - 13:30'
        },
      ],
    },
  ],
});

export default mongoose.model("Availability", AvailabilitySchema);
