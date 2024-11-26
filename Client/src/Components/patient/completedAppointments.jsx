import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, message, Spin, Button } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are imported
import { Link } from "react-router-dom";

const { Title } = Typography;

const CompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Fetch the patient appointments when the component loads
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/patient-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments. Please try again.");
        message.error("Failed to fetch appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // Show spinner while loading
  if (loading) {
    return (
      <Spin
        tip="Loading appointments..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );
  }

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  );

  // Define table columns
  const columns = [
    {
      title: "Doctor",
      dataIndex: ["dentistId", "name"],
      key: "dentist",
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "time",
    },
    {
      title: "Hospital",
      dataIndex: "hospitalID",
      key: "hospital",
      render: (hospital) => `${hospital.hospitalName}, ${hospital.address}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.status === "Completed") {
          console.log("review", record.review);
          if (record.review && record.review.length > 0) {
            return <strong>Review Added</strong>; // Display if review exists
          } else {
            return (
              <Link to={`${record._id}`}>
                <Button type="primary">Add Review</Button>
              </Link>
            );
          }
        }
      },
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Your Appointments
      </Title>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Title level={3}>Completed Appointments</Title>
      <Table
        columns={columns}
        dataSource={completedAppointments}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
};

export default CompletedAppointments;
