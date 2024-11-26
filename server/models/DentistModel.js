import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    bds_no: {
      type: String,
      required: true,
    },
    fee: {
      type: String,
      required: true,
    },
    profile_img: {
      type: String,
    },
    role: {
      type: Number,
      default: 1,
    },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
    },
    hospital: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }], // Ensure it's an array of ObjectIds
  },
  { timestamps: true }
);

// Before saving the dentist, hash the password
DentistSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("Dentist", DentistSchema);
