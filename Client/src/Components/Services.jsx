import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Services.css"; // Import custom styles
import img1 from "../Images/AB.png";
import img2 from "../Images/DD.png";
import img3 from "../Images/PT.png";

const ServicesSection = () => {
  return (
    <section id="services" className="container Services-Section my-5 py-5">
      <div className="row text-center">
        <div className="col-12 mb-5">
          <h2 className="display-4 fw-bold mb-4">Our Services</h2>
          <p className="lead mb-5">
            Explore our range of dental services designed to cater to all your
            oral health needs.
          </p>
        </div>
        {/* Card 1 */}
        <div className="col-md-4 mb-4">
          <div className="service-card">
            <div className="card-img-container">
              <img
                src={img1}
                alt="Service 1"
                className="card-img-top service-card-img"
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title">Appointment Booking</h5>
              <p className="card-text">
                You can book an appointment with any nearby doctor using our
                platform.
              </p>
              <a href="#" className="btn btn-custom">
                Learn More
              </a>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="col-md-4 mb-4">
          <div className="service-card">
            <div className="card-img-container">
              <img
                src={img2}
                alt="Service 2"
                className="card-img-top service-card-img"
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title">Disease Detection</h5>
              <p className="card-text">
                You can detect dental diseases using AI on our platform.
              </p>
              <a href="#" className="btn btn-custom">
                Learn More
              </a>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="col-md-4 mb-4">
          <div className="service-card">
            <div className="card-img-container">
              <img
                src={img3}
                alt="Service 3"
                className="card-img-top service-card-img"
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title">Personalized Treatments</h5>
              <p className="card-text">
                After detecting the disease, we offer personalized home
                remedies.
              </p>
              <a href="#" className="btn btn-custom">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
