import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="text-center text-lg-start text-white"
      style={{
        backgroundColor: "black",
        paddingTop: "40px",
        paddingBottom: "20px",
      }}
    >
      <div className="container p-4 pb-0">
        <section>
          <div className="row">
            {/* Company Info */}
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">
                OraCure-AI
              </h6>
              <p>
              The OraCure-AI is a web-based application that uses AI to identify common dental diseases from images and allows patients to book appointments with nearby dentists. 
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* Products */}
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Products</h6>
              <p>
                <a className="text-white">Disease Detection</a>
              </p>
              <p>
                <a className="text-white">Remedies Suggestion</a>
              </p>
              <p>
                <a className="text-white">Appointment Booking</a>
              </p>
              <p>
                <a className="text-white">Dashboards</a>
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* Useful Links */}
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">
                Useful Links
              </h6>
              <p>
                <a className="text-white">Home</a>
              </p>
              <p>
                <a className="text-white">Services</a>
              </p>
              <p>
                <a className="text-white">About</a>
              </p>
              <p>
                <a className="text-white">Contact</a>
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* Contact Info */}
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
              <p>
                <i className="fas fa-home mr-3"></i> 123 Main St, Islamabad, Pakistan
              </p>
              <p>
                <i className="fas fa-envelope mr-3"></i> OraCureAI@gmail.com
              </p>
              <p>
                <i className="fas fa-phone mr-3"></i> +01 234 567 88
              </p>
              <p>
                <i className="fas fa-print mr-3"></i> +01 234 567 89
              </p>
            </div>
          </div>
        </section>

        <hr className="my-3" />

        <section className="p-3 pt-0">
          <div className="row d-flex align-items-center">
            <div className="col-md-7 col-lg-8 text-center text-md-start">
              <div className="p-3">
                © {new Date().getFullYear()} All Rights Reserved by:
                <strong> Ora Cure</strong>
              </div>
            </div>

            <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
              <a
                className="btn btn-outline-light btn-floating m-1"
                role="button"
              >
                <FaFacebookF />
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                role="button"
              >
                <FaTwitter />
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                role="button"
              >
                <FaInstagram />
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                role="button"
              >
                <FaLinkedinIn />
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                role="button"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
