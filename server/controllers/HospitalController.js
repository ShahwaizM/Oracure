import HospitalModel from "../models/HospitalModel.js";

// Fetch all Hospiatls
export const getHospital = async (req, res) => {
  try {
    const Hospiatls = await HospitalModel.find();
    res.status(200).json(Hospiatls);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
