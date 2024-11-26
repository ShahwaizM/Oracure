import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Header.css"; // Import custom styles
import logo from "../Images/logo.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons"; // Icons for appointments
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if token exists to determine if user is logged in
  const userRole = localStorage.getItem("role"); // Get user role from local storage
  const Id = localStorage.getItem("id");

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token"); // Clear the token from local storage
    localStorage.removeItem("role"); // Clear the user role from local storage
    navigate("/login"); // Redirect to the login page
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container">
        <a
          className="navbar-brand d-flex align-items-center"
          onClick={() => navigate("/")}
        >
          <img src={logo} className="brand-logo" alt="Brand Logo" />
          <span className="brand-name ms-2">OraCure-AI</span>
          {/* Brand name beside the logo */}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                onClick={() => navigate("/")}
                className="nav-link rounded-hover"
              >
                <a onClick={() => navigate("/")}>Home</a>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link rounded-hover" href="#about">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link rounded-hover" href="#contact">
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link rounded-hover" href="#services">
                Services
              </a>
            </li>
            <li className="nav-item">
              <div className="btn-group">
                {token ? (
                  <>
                    {userRole === "3" ? (
                      // Assuming role '3' is for admins
                      <Link
                        to="/admin/dashboard"
                        className="btn btn-outline-primary btn-hover"
                      >
                        Admin Dashboard
                      </Link>
                    ) : userRole === "1" ? (
                      // Role '1' for doctors
                      <Link
                        to="/dentist/dashboard"
                        className="btn btn-outline-primary btn-hover"
                      >
                        Doctor Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/patient/dashboard"
                        className="btn btn-outline-primary btn-hover"
                      >
                        Patient Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger btn-hover"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn btn-outline-primary btn-hover"
                    >
                      Login
                    </Link>
                    <Link
                      to="/PreSignUpPage"
                      className="btn btn-outline-primary btn-hover"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
