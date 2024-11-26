import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/UserSignUp.css"; // Path to your CSS file
import brandLogo from "../Images/logo4.png"; // Replace with the path to your logo
import Header from "./Header";
import axios from "axios";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const UserSignUp = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signup",
        userData
      );
      console.log("User signed up:", response.data);
      toast.success("Signed Up Succesfully!");
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
      <div className="user-signup-container d-flex justify-content-center align-items-center min-vh-80">
        <div className="user-signup-card p-4 shadow-lg ">
          <h3 className="text-center mb-3">Create a New Account</h3>

          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className="form-control"
                id="gender"
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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

export default UserSignUp;
