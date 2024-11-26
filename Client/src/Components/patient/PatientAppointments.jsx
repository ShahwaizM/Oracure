import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, message, Spin, Button } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are imported
import { Link } from "react-router-dom";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const { Title } = Typography;

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Function to handle appointment cancellation
  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        serverUrl + "/auth/cancelAppointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(response.data.message); // Display success message
      setAppointments(appointments.filter((apt) => apt._id !== appointmentId)); // Remove cancelled appointment
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      message.error("Failed to cancel appointment");
    }
  };

  // Fetch the patient appointments when the component loads
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          serverUrl + "/auth/patient-appointments",
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

  // Filter appointments based on status
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  );
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  );
  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
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
          return record.review && record.review.length > 0 ? (
            <strong>Review Added</strong>
          ) : (
            <></>
          );
        }

        if (record.status === "Pending") {
          return (
            <Button
              onClick={() => cancelAppointment(record._id)}
              type="primary"
              danger
              style={{ marginTop: "10px" }}
            >
              Cancel Appointment
            </Button>
          );
        }

        return null;
      },
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Your Appointments
      </Title>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Title level={3}>Pending Appointments</Title>
      <Table
        columns={columns}
        dataSource={pendingAppointments}
        rowKey="_id"
        pagination={false}
      />

      <Title level={3}>Completed Appointments</Title>
      <Table
        columns={columns}
        dataSource={completedAppointments}
        rowKey="_id"
        pagination={false}
      />

      <Title level={3}>Cancelled Appointments</Title>
      <Table
        columns={columns}
        dataSource={cancelledAppointments}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
};

export default PatientAppointments;
