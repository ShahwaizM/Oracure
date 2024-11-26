// DMainLayout.js
import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  HddOutlined,
  FileTextOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const DMainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    localStorage.removeItem("role"); // Clear the user role from local storage
    localStorage.removeItem("id");
    navigate("/login"); // Redirect to the login page
  };
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#001529" }}>
      <Sider width={280} style={{ backgroundColor: "#001529" }}>
        <div
          className="logo"
          style={{ color: "white", padding: "16px", fontSize: "20px" }}
        >
          <Link to="/">OraCure-AI</Link>{" "}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/dentist/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<HddOutlined />}>
            <Link to="/dentist/set-availability">Set Availabiltity</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>
            <Link to="/dentist/update-details">Update Profile</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<FileTextOutlined />}>
            <Link to="/dentist/appointments">Appointments</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
            <Link to="/dentist/Reviews">Reviews</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "green",
            color: "white",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Center items vertically
            padding: "0 20px", // Optional padding for aesthetics
          }}
        >
          <h2 style={{ margin: "10px 0" }}>Dentist Dashboard</h2>
          <Button
            type="primary"
            onClick={handleLogout}
            icon={<LogoutOutlined />} // Add the logout icon here
          >
            Logout
          </Button>{" "}
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DMainLayout;
