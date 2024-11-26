// ForgotPassword.js
import React, { useState } from "react";
import { message, Form, Input, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );
      message.success(response.data.message); // OTP sent message
      localStorage.setItem("otpToken", response.data.otpToken); // Store the OTP token in local storage for later use
      navigate("/verify-otp");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error sending OTP, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "50px 0" }}>
      <h2>Forgot Password</h2>
      <Form layout="vertical" onFinish={handleForgotPassword}>
        <Form.Item label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
