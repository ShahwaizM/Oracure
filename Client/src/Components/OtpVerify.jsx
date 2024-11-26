// VerifyOTP.js
import React, { useState } from "react";
import { message, Form, Input, Button } from "antd";
import axios from "axios";

const VerifyOTP = () => {
  const [email, setEmail] = useState(""); // Add email state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const otpToken = localStorage.getItem("otpToken"); // Get the OTP token from localStorage
      const response = await axios.post(
        "http://localhost:5000/auth/verify-otp",
        {
          email, // Send the email for verification
          otp,
          otpToken,
          newPassword,
        }
      );
      message.success(response.data.message); // Password reset success message
      localStorage.removeItem("otpToken"); // Remove the OTP token from localStorage after success
    } catch (error) {
      message.error(
        error.response?.data?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "50px 0" }}>
      <h2>Verify OTP</h2>
      <Form layout="vertical" onFinish={handleVerifyOTP}>
        <Form.Item label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </Form.Item>
        <Form.Item label="Enter OTP" required>
          <Input
            type="text"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
          />
        </Form.Item>
        <Form.Item label="New Password" required>
          <Input.Password
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOTP;
