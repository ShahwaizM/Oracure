import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, message, Spin, Button } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are imported

const { Title } = Typography;

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToday, setShowToday] = useState(false); // State to manage filtering

  const markComplete = async (appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/markComplete",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(response.data.message); // Show success message
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: "Completed" } : apt
        )
      ); // Update the status in the state
    } catch (error) {
      console.error("Error marking appointment complete:", error);
      message.error("Failed to mark appointment as complete");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust as needed

        const response = await axios.get(
          "http://localhost:5000/auth/doctor-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
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
  }, []);

  // Function to filter appointments for today
  const getTodaysAppointments = () => {
    const today = new Date();
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate()
      );
    });
  };

  if (loading) {
    return (
      <Spin
        tip="Loading appointments..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );
  }

  const displayedAppointments = showToday
    ? getTodaysAppointments()
    : appointments;

  // Filter appointments by status
  const pendingAppointments = displayedAppointments.filter(
    (appointment) => appointment.status === "Pending"
  );
  const completedAppointments = displayedAppointments.filter(
    (appointment) => appointment.status === "Completed"
  );
  const cancelledAppointments = displayedAppointments.filter(
    (appointment) => appointment.status === "Cancelled"
  );

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Patient",
      dataIndex: ["patientId", "name"],
      key: "patient",
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(), // Format date
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
      render: (hospital) => `${hospital.hospitalName}, ${hospital.address}`, // Hospital details
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "Pending" ? (
          <Button onClick={() => markComplete(record._id)} type="primary">
            Mark as Complete
          </Button>
        ) : null,
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Doctor's Appointments
      </Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button
        onClick={() => setShowToday(!showToday)}
        style={{ marginBottom: "16px" }}
      >
        {showToday ? "Show All Appointments" : "Show Today's Appointments"}
      </Button>

      <Title level={3}>Pending Appointments</Title>
      <Table
        columns={columns}
        dataSource={pendingAppointments}
        rowKey="_id"
        pagination={false}
      />
      <hr />
      <Title level={3}>Completed Appointments</Title>
      <Table
        columns={columns}
        dataSource={completedAppointments}
        rowKey="_id"
        pagination={false}
      />
      <hr />
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

export default DoctorAppointments;
