import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchsingleDentist, bookAppointmentAPI } from "../helper/getusers.js"; // Ensure bookAppointmentAPI is defined
import { Card, Form, Select, Button, Spin, message } from "antd"; // Import components from Ant Design
// import "./AppointmentBooking.css"; // Optional: Custom styles
import "antd/dist/reset.css"; // Resetting AntD styles if needed
import "../Styles/BookAppointment.css"

const AppointmentBooking = () => {
  const { id } = useParams(); // Get the doctor ID from the URL
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dentist, setDentist] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();
  useEffect(() => {
    const loadDentist = async () => {
      if (id) {
        try {
          const dentistData = await fetchsingleDentist(id); // Fetch dentist's availability data
          setDentist(dentistData);

          // Assuming the availability data is structured correctly
          if (dentistData && dentistData.availability) {
            setAvailableDates(dentistData.availability.availableDates); // Set available dates
          }
        } catch (error) {
          console.error("Error fetching dentist data:", error);
          message.error("Error loading dentist data.");
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };
    loadDentist();
  }, [id]);

  const handleDateChange = (value) => {
    setSelectedDate(value);
    setSelectedTime(""); // Reset time

    const selectedAvailability = availableDates.find(
      (date) => new Date(date.date).toLocaleDateString("en-US") === value
    );

    if (selectedAvailability) {
      setTimeSlots(selectedAvailability.timeSlots || []); // Ensure timeSlots is an array
    } else {
      setTimeSlots([]); // Clear time slots if no matching date
    }
  };

  const handleBookAppointment = async () => {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage

    try {
      if (selectedDate && selectedTime) {
        const response = await bookAppointmentAPI(
          id,
          selectedDate,
          selectedTime,
          token
        );
        if (response.message) {
          message.success(response.message);
        }
        navigate("/patient/appointments");
      } else {
        message.warning("Please select both a date and a time slot.");
      }
    } catch (error) {
      message.error("Error booking appointment.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    ); // Loading state
  }

  if (!dentist) {
    return <div>Doctor not found.</div>; // Handle case when dentist is not found
  }

  return (
    <div className="appointment-container">
      <Card
        title="Book an Appointment"
        bordered={false}
        style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
      >
        <h1>{dentist.name}</h1>
        <Form layout="vertical">
          <Form.Item label="Select a date:" required>
            <Select
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Select a date"
              options={availableDates.map((dateObj) => ({
                label: `${new Date(dateObj.date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}, ${new Date(dateObj.date).toLocaleDateString()}`,
                value: new Date(dateObj.date).toLocaleDateString(),
              }))}
            />
          </Form.Item>

          <Form.Item label="Select a time slot:" required>
            <Select
              value={selectedTime}
              onChange={setSelectedTime}
              placeholder="Select a time slot"
              disabled={!selectedDate}
              options={
                timeSlots.length > 0
                  ? timeSlots.map((slot) => ({ label: slot, value: slot }))
                  : [{ label: "No available time slots", value: "" }]
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              disabled={!selectedDate || !selectedTime}
              onClick={handleBookAppointment}
              block
            >
              Book Appointment
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
