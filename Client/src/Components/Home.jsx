import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Home.css"; // Import custom styles
import home from "../Images/home4.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero-section">
      <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-center">
        {/* Left side - Brand details */}
        <div className="hero-content col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
          <h1 className="hero-heading">OraCure-AI</h1>
          <p className="hero-tagline">
            Dental Disease Detection Using Artificial Intelligence
          </p>
          <p className="hero-description">
            A platform that uses AI to detect dental diseases from images and
            enables patients to book appointments with nearby dentists.{" "}
          </p>
          <div className="hero-buttons d-flex justify-content-center justify-content-lg-start">
            <Link to="/DiseaseDetectionPage">
              <button className="btn btn-primary me-3">Identify Disease</button>
            </Link>
            <Link to="/AppointmentBookingPage">
              <button className="btn btn-outline-primary">
                Book Appointment
              </button>
            </Link>
          </div>
        </div>
        {/* Right side - Image */}
        <div className="col-lg-6 text-center">
          <img
            src={home}
            alt="Brand Related"
            className="hero-image img-fluid"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
