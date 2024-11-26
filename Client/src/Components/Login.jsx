import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Login.css"; // Reuse the styling from UserSignUp.css
import brandLogo from "../Images/About.png"; // Replace with the path to your logo
import Header from "./Header";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        loginData
      );
      const { token, role, id, redirect } = response.data;

      // Save the token to localStorage (or any other storage you're using)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // Store the role
      localStorage.setItem("id", id); // Store user ID

      // Redirect based on role
      toast.success("Welcome, Logged In!");
      navigate(`/${redirect}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <Header />
      <div className="login-container d-flex justify-content-center LoginPage align-items-center ">
        <div className="login-card p-4 shadow-lg ">
          <h3 className="text-center mb-3">Login to your Account</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={loginData.email}
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
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <div className="text-center mt-3">
              <a href="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
