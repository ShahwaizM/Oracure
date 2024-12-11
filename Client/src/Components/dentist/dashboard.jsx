import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const { Title, Paragraph } = Typography;

const DentistDashboard = () => {
  const navigate = useNavigate();
  const [dentist, setDentist] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState({
    completed: 0,
    pending: 0,
  });
  const dentistId = localStorage.getItem("id");

  useEffect(() => {
    const fetchDentistDetails = async () => {
      try {
        const dentistResponse = await axios.get(
          `${serverUrl}/auth/getDentist/${dentistId}`
        );
        setDentist(dentistResponse.data);
      } catch (error) {
        console.error("Error fetching dentist details:", error);
      }
    };

    const fetchAppointmentStats = async () => {
      try {
        const statsResponse = await axios.get(
          `${serverUrl}/auth/appointmentStats/${dentistId}`
        );
        setAppointmentStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching appointment stats:", error);
      }
    };

    fetchDentistDetails();
    fetchAppointmentStats();
  }, [dentistId]);

  if (!dentist) {
    return <p>Loading...</p>;
  }

  const data = [
    { name: "Completed", value: appointmentStats.completed },
    { name: "Pending", value: appointmentStats.pending },
  ];

  const COLORS = ["#4CAF50", "#FF5722"];
  console.log(dentist.availability);
  // Check if dentist is loaded
  if (!dentist || !dentist.availability) {
    return <p>Loading...</p>; // Display a loading state or an error message
  }

  const availabilityData = dentist.availability.days.map((day) => ({
    key: day, // Use the day as the key
    day: day, // Each day as a separate entry
    timing: `${dentist.availability.startTime} -- ${dentist.availability.endTime}`, // Displaying the same timing for all days
  }));

  const columns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "Timing",
      dataIndex: "timing",
      key: "timing",
    },
  ];

  return (
    <Row>
      <Col md={8}>
        <div className="text-center">
          <img
            src={`${dentist.profile_img}`}
            alt={dentist.name}
            className="img-fluid rounded-circle mb-3 shadow"
            style={{
              width: "200px",
              height: "200px",
              border: "5px solid #4CAF50",
            }}
          />
          <Title level={2} style={{ color: "#333" }}>
            Dr. {dentist.name}
          </Title>{" "}
        </div>
        <div className="text-center">
          <Paragraph style={{ fontSize: "20px", margin: 0 }}>
            <strong>Specialization:</strong> {dentist.specialization}
          </Paragraph>
          <Paragraph style={{ fontSize: "20px", margin: 0 }}>
            <strong>Designation:</strong> {dentist.designation}
          </Paragraph>
          <Paragraph style={{ fontSize: "20px", margin: 0 }}>
            <strong>Education:</strong> {dentist.education}
          </Paragraph>
          <Paragraph style={{ fontSize: "20px", margin: 0 }}>
            <strong>Fees:</strong> PKR {dentist.fee}
          </Paragraph>
          <Paragraph style={{ fontSize: "20px", margin: 0 }}>
            <strong>Hospital:</strong>{" "}
            {dentist.hospital[0]?.hospitalName || "N/A"}
          </Paragraph>
        </div>
      </Col>

      <Col md={6} className="mx-5">
        <Typography.Title level={3} className="mt-4">
          Availability
        </Typography.Title>
        <Table
          dataSource={availabilityData}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </Col>
      <Col xs={24} md={8} className="ml-4">
        <Title level={3} className="mt-4" style={{ color: "#4CAF50" }}>
          Appointment Statistics
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Row gutter={16} className="mt-2">
          <Col xs={24} sm={10}>
            <Card
              className="text-center shadow"
              style={{ backgroundColor: "#e8f5e9", borderRadius: "10px" }}
            >
              <Statistic
                title={
                  <span>
                    <CheckCircleOutlined style={{ color: "#4CAF50" }} />{" "}
                    Completed Appointments
                  </span>
                }
                value={appointmentStats.completed}
                valueStyle={{ color: "#4CAF50" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={10}>
            <Card
              className="text-center shadow"
              style={{ backgroundColor: "#ffebee", borderRadius: "10px" }}
            >
              <Statistic
                title={
                  <span>
                    <ClockCircleOutlined style={{ color: "#FF5722" }} /> Pending
                    Appointments
                  </span>
                }
                value={appointmentStats.pending}
                valueStyle={{ color: "#FF5722" }}
              />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DentistDashboard;
