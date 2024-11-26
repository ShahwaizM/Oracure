import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/PreSignUpPage.css"; // Import custom styles
import Header from "./Header";
import axios from "axios";

const PreSignUpPage = () => {
  return (
    <>
      <Header />

      <Container
        fluid
        className="sign-up-options-container d-flex justify-content-center align-items-center min-vh-100"
      >
        <Row className="text-center">
          <Col md={6} className="mb-4 mb-md-0">
            <div className="sign-up-card doctor-card">
              <h2 className="card-title">Sign Up as a Doctor</h2>
              <p className="card-description">
                Join our platform as a doctor and offer your expertise to
                patients. Sign up to create your profile and start managing
                appointments today.
              </p>
              <Link to="/DoctorSignUp">
                <Button className="btn-sign-up ">Sign Up as Doctor</Button>
              </Link>
            </div>
          </Col>
          <Col md={6}>
            <div className="sign-up-card patient-card">
              <h2 className="card-title">Sign Up as a Patient</h2>
              <p className="card-description">
                Register as a patient to book appointments, access your health
                records, and find the right care for you.
              </p>
              <Link to="/UserSignUp">
                <Button className="btn-sign-up">Sign Up as Patient</Button>
              </Link>
            </div>
          </Col>
        </Row>
        {" "}
      </Container>
    </>
  );
};

export default PreSignUpPage;
