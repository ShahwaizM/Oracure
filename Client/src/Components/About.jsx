import React, { useEffect, useState } from "react";
import "../Styles/About.css"; // Import your CSS file for styling
import img from "../Images/About.png";
import axios from "axios";
const About = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalHospitals: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section id="about" className="py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
            <h2 className="mb-4 display-5 text-center about-heading">
              About Us
            </h2>
            <p className="text-dark mb-5 text-center lead fs-4 about-description">
              At OraCure-AI, we are dedicated to providing innovative solutions
              that cater to the unique needs of our clients, driven by a
              commitment to excellence and teamwork.
            </p>
            <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row gy-4 gy-lg-0 align-items-lg-center">
          <div className="col-12 col-lg-6">
            <img
              className="img-fluid  rounded border border-dark"
              loading="lazy"
              src={img} // Replace with your image path
              alt="About Us"
            />
          </div>
          <div className="col-12 col-lg-6 col-xxl-6">
            <div className="row justify-content-lg-end">
              <div className="col-12 col-lg-11">
                <div className="about-wrapper">
                  <p className="lead mb-4 mb-md-5 about-text">
                    We believe in making a positive impact on our communities
                    and the environment. Through strategic initiatives and
                    partnerships, we strive for sustainability and advancement
                    in social welfare and education.
                  </p>
                  <div className="row gy-4 mb-4 mb-md-5">
                    <div className="col-12 col-md-6">
                      <div className="card border border-dark">
                        <div className="card-body p-4">
                          <h3 className="display-5 fw-bold text-primary text-center mb-2">
                            {stats.totalDoctors}
                          </h3>
                          <p className="fw-bold text-center m-0">
                            Qualified Experts
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="card border border-dark">
                        <div className="card-body p-4">
                          <h3 className="display-5 fw-bold text-primary text-center mb-2">
                            {stats.totalPatients}
                          </h3>
                          <p className="fw-bold text-center m-0">
                            Satisfied Clients
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="#!" className="btn btn-primary bsb-btn-2xl">
                    Explore
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-arrow-right-short"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
