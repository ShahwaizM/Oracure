import mongoose from "mongoose";
const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  dentists: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dentist",
  }, // Array of dentists associated with the hospital
});
export default mongoose.model("Hospital", hospitalSchema);
