import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";
import MainLayout from "./MainLayout"; // Assuming this is the layout with sidebar
const serverUrl = import.meta.env.VITE_SERVER_URL;

const DeleteUsers = () => {
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState(""); // 'patient' or 'dentist'

  // Fetch all patients and dentists
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const patientResponse = await axios.get(serverUrl + "/auth/patients");
        const dentistResponse = await axios.get(serverUrl + "/auth/dentists");

        setPatients(patientResponse.data);
        setDentists(dentistResponse.data);
      } catch (error) {
        message.error("Error fetching users");
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete with confirmation modal
  const showDeleteModal = (user, type) => {
    setSelectedUser(user);
    setUserType(type);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async () => {
    const id = selectedUser._id;
    const deleteUrl =
      userType === "patient"
        ? `${serverUrl}/auth/deletePatient/${id}`
        : `${serverUrl}/auth/deleteDentist/${id}`;

    try {
      await axios.delete(deleteUrl);
      message.success(
        `${userType === "patient" ? "Patient" : "Dentist"} deleted successfully`
      );

      // Update the local state
      if (userType === "patient") {
        setPatients(patients.filter((patient) => patient._id !== id));
      } else {
        setDentists(dentists.filter((dentist) => dentist._id !== id));
      }
    } catch (error) {
      message.error("Error deleting user");
      console.error("Error deleting user", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  // Columns for Ant Design Table component
  const patientColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: (_, patient) => (
        <Button danger onClick={() => showDeleteModal(patient, "patient")}>
          Delete
        </Button>
      ),
    },
  ];

  const dentistColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: (_, dentist) => (
        <Button danger onClick={() => showDeleteModal(dentist, "dentist")}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <h3 style={{ color: "black" }}>Patients</h3>
      <Table
        dataSource={patients}
        columns={patientColumns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <h3 style={{ color: "black", marginTop: "0px" }}>Dentists</h3>
      <Table
        dataSource={dentists}
        columns={dentistColumns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={`Delete ${userType === "patient" ? "Patient" : "Dentist"}`}
        visible={isModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => setIsModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this {userType}?</p>
      </Modal>
    </>
  );
};

export default DeleteUsers;
