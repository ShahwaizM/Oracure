import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  given: {
    type: Boolean,
    default: false,
  },
  stars: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  title: {
    type: String,
    default: "",
  },
  comment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Store the review submission date
  },
});

export default mongoose.model("Review", ReviewSchema);
