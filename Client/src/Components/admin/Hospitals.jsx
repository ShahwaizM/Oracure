// Hospitals.js
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const response = await axios.get(serverUrl + "/auth/hospitals");
      setHospitals(response.data);
    };
    fetchHospitals();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "hospitalName",
      key: "hospitalName",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
  ];

  return (
    <>
      <h1>Hospitals</h1>
      <Table dataSource={hospitals} columns={columns} rowKey="_id" />
    </>
  );
};

export default Hospitals;
