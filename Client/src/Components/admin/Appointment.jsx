import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/ap");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patient) =>
        patient ? `${patient.name} (${patient.email})` : "N/A",
    },
    {
      title: "Dentist",
      dataIndex: "dentistId",
      key: "dentistId",
      render: (dentist) =>
        dentist ? `${dentist.name} (${dentist.email})` : "N/A",
    },
    {
      title: "Hospital",
      dataIndex: "hospitalID",
      key: "hospitalID",
      render: (hospital) =>
        hospital ? `${hospital.hospitalName}, ${hospital.address}` : "N/A",
    },
    {
      title: "Appointment Date & Time",
      key: "dateTime",
      render: (record) =>
        `${new Date(record.appointmentDate).toLocaleDateString()} - ${
          record.appointmentTime
        }`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <>
      <h1>Appointments</h1>
      <Table dataSource={appointments} columns={columns} rowKey="_id" />
    </>
  );
};

export default Appointments;
