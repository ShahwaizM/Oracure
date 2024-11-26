// Hospitals.js
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const response = await axios.get("http://localhost:5000/auth/hospitals");
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
