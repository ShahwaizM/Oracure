import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { fetchDentists, fetchPatients } from "../../helper/getusers.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap 5 styles
import "antd/dist/reset.css"; // Resetting AntD styles if needed

const Users = () => {
  const [dentists, setDentists] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dentistsData = await fetchDentists();
      const patientsData = await fetchPatients();
      setDentists(dentistsData);
      setPatients(patientsData);
    };

    fetchData();
  }, []);

  // Columns configuration for Ant Design Table for dentists
  const dentistColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "BDS Number",
      dataIndex: "bds_no",
      key: "bds_no",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
    },
  ];

  // Columns configuration for Ant Design Table for patients
  const patientColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <>
      <div className="">
        <h2>Dentists</h2>
        <Table
          columns={dentistColumns}
          dataSource={dentists}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 5 }}
          className="shadow p-3 mb-5 bg-white rounded"
        />
      </div>
      <br />
      <div className="">
        <h2>Patients</h2>
        <Table
          columns={patientColumns}
          dataSource={patients}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 5 }}
          className="shadow p-3 mb-5 bg-white rounded"
        />
      </div>
    </>
  );
};

export default Users;
