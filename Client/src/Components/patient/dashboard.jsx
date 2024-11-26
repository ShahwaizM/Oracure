import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Typography, Spin, message } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are imported
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap styles are imported
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const { Title, Text } = Typography;
const serverUrl = import.meta.env.VITE_SERVER_URL;
const PatientDashboard = () => {
  const id = localStorage.getItem("id"); // Patient ID from localStorage
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(id);
  // Fetch patient data
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`${serverUrl}/auth/getPatients/${id}`);
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient details", error);
        message.error("Failed to fetch patient details");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spin size="large" />
      </div>
    );
  }

  if (!patientData) {
    return <Text type="danger">No patient data found.</Text>;
  }

  return (
    <div className="container mt-4">
      <Card title="Profile Details" bordered={true} className="shadow-sm">
        <div className="mb-3">
          <p className="fw-bold">Name:</p>
          <p>{patientData.name}</p>
        </div>
        <div className="mb-3">
          <p className="fw-bold">Email:</p>
          <p>{patientData.email}</p>
        </div>
        <div className="mb-3">
          <p className="fw-bold">Phone:</p>
          <p>{patientData.phone}</p>
        </div>
        <div className="mb-3">
          <p className="fw-bold">Gender:</p>
          <p>{patientData.gender}</p>
        </div>
      </Card>
      <Button href="/AppointmentBookingPage">Book Appointment</Button>{" "}
    </div>
  );
};

export default PatientDashboard;
