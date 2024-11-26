import React, { useState } from "react";
import { Checkbox, TimePicker, Button, message, Card } from "antd";
import "antd/dist/reset.css"; // Ensure you import Ant Design styles
import moment from "moment"; // For handling time formatting
import { useNavigate } from "react-router-dom";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const SetAvailability = ({ dentistId }) => {
  const [days, setWorkingDays] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleWorkingDayChange = (day) => {
    setWorkingDays(
      (prevDays) =>
        prevDays.includes(day)
          ? prevDays.filter((d) => d !== day) // Remove the day if it's already selected
          : [...prevDays, day] // Add the day if it's not selected
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage

    if (!startTime || !endTime || days.length === 0) {
      message.error("Start time, end time, and at least one day are required.");
      setLoading(false);
      return;
    }

    if (startTime >= endTime) {
      message.error("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(serverUrl + "/auth/setAvailability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Ensure the token is prefixed with "Bearer "
        },
        body: JSON.stringify({
          startTime: startTime.format("HH:mm"), // Format time as HH:mm
          endTime: endTime.format("HH:mm"),
          days,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save timings. Please try again.");
      }

      message.success("Clinic timings saved successfully!");
      // navigate("/");
      setWorkingDays([]); // Clear the selected days after successful submission
      setStartTime(null); // Reset the start time
      setEndTime(null); // Reset the end time
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Set Availability"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <h3>Select Working Days:</h3>
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
        <Checkbox
          key={day}
          checked={days.includes(day)} // Set the checked state based on the days state
          onChange={() => handleWorkingDayChange(day)}
        >
          {day}
        </Checkbox>
      ))}

      <h3>Set Time:</h3>
      <label style={{ display: "block", margin: "10px 0" }}>
        Start Time:
        <TimePicker
          value={startTime}
          onChange={(time) => setStartTime(time)}
          format={"HH:mm"}
          style={{ width: "100%" }}
        />
      </label>
      <label style={{ display: "block", margin: "10px 0" }}>
        End Time:
        <TimePicker
          value={endTime}
          onChange={(time) => setEndTime(time)}
          format={"HH:mm"}
          style={{ width: "100%" }}
        />
      </label>

      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        style={{ marginTop: "20px" }}
      >
        Set Availability
      </Button>
    </Card>
  );
};

export default SetAvailability;
