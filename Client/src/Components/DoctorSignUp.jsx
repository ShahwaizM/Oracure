import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/DoctorSignUp.css";
import brandLogo from "../Images/logo4.png"; // Replace with the path to your logo
import Header from "./Header";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const DoctorSignUp = () => {
  const navigate = useNavigate();
  const [profile_img, setprofile_img] = useState("");

  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    clinical_address: "",
    clinic_name: "",
    fee: "",
    city: "",
    designation: "",
    specialization: "",
    education: "",
    bds_no: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    Object.keys(doctorData).forEach((key) => {
      formData.append(key, doctorData[key]);
    });
    formData.append("profile_img", profile_img);
    console.log(profile_img);
    // Log each key-value pair in the FormData object
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(serverUrl + "/auth/dsignup", formData);
      toast.success("Signed Up Succesfully!");

      console.log("Dentist signed up:", response.data);
      navigate("/login");
    } catch (error) {
      console.error(
        "Error during sign up:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "Error during sign up:",
        error.response ? error.response.data : error.message
      );
    }
  };
  return (
    <>
      <Header />
      <div className="doctor-signup-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="doctor-signup-card p-4 shadow-lg rounded">
          <h3 className="text-center mb-3">Create a New Account</h3>

          <form onSubmit={handleSignUp}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={doctorData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={doctorData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={doctorData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={doctorData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="hospital/clinic_Name" className="form-label">
                  Hospital/Clinic Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clinic_name"
                  name="clinic_name"
                  value={doctorData.clinic_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="hospital/fee" className="form-label">
                  Hospital/Clinic Fee
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fee"
                  name="fee"
                  value={doctorData.fee}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="clinical_address" className="form-label">
                  Hospital/Clinic Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clinical_address"
                  name="clinical_address"
                  value={doctorData.clinical_address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="city" className="form-label">
                  city
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={doctorData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="designation" className="form-label">
                  Designation
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="designation"
                  name="designation"
                  value={doctorData.designation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="education" className="form-label">
                  Education
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="education"
                  name="education"
                  value={doctorData.education}
                  onChange={handleInputChange}
                  required
                />
              </div>{" "}
              <div className="col-md-6 mb-3">
                <label htmlFor="specialization" className="form-label">
                  Specialization
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="specialization"
                  name="specialization"
                  value={doctorData.specialization}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="bds_no" className="form-label">
                  BDS Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bds_no"
                  name="bds_no"
                  value={doctorData.bds_no}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="image" className="form-label">
                  Personal Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setprofile_img(e.target.files[0])}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorSignUp;
