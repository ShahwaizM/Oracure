// Dashboard.js
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalHospitals: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(serverUrl + "/auth/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card
          className="text-align-center"
          style={{ backgroundColor: "#2b2b2b", color: "white" }}
        >
          <h1> Registered Doctors</h1>
          <h1> {stats.totalDoctors}</h1>{" "}
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ backgroundColor: "green", color: "#fff" }}>
          <h1>Registered Patients</h1>
          <h1> {stats.totalPatients}</h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ backgroundColor: "orange", color: "#fff" }}>
          <h1>Registered Hospitals</h1>
          <h1>{stats.totalHospitals}</h1>{" "}
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ backgroundColor: "red", color: "#fff" }}>
          <h1>Appointment Booked</h1>
          <h1>{stats.totalAppointments}</h1>
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
