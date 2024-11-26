import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { fetchDentists } from "../helper/getusers.js"; // Importing fetchDentists function
import "../Styles/AppointmentBookingCard.css"; // Import custom styles
import { Link, useNavigate } from "react-router-dom";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const AppointmentBookingCard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDentists = async () => {
      const dentistsData = await fetchDentists();
      setDoctors(dentistsData); // Set original doctors list
      setFilteredDoctors(dentistsData); // Set filtered doctors to the same initially
    };
    loadDentists();
  }, []);

  // Function to handle filtering based on name and location
  const handleSearch = () => {
    const filtered = doctors.filter((doctor) => {
      const doctorName = doctor.name ? doctor.name.toLowerCase() : "";
      const doctorLocation = doctor.hospital[0].city
        ? doctor.hospital[0].city.toLowerCase()
        : "";
      const matchesName = doctorName.includes(searchName.toLowerCase());
      const matchesLocation = doctorLocation.includes(
        searchLocation.toLowerCase()
      );
      return (
        (searchName === "" || matchesName) &&
        (searchLocation === "" || matchesLocation)
      );
    });
    setFilteredDoctors(filtered);
  };

  // Trigger filtering every time the name or location changes
  useEffect(() => {
    handleSearch();
  }, [searchName, searchLocation, doctors]);

  return (
    <div className="container-fluid">
      <div className="container">
        {/* Sub-navigation for search filters */}
        <div className="sub-nav mb-4">
          <Row>
            <Col md={6}>
              <Form.Group controlId="searchName">
                <Form.Control
                  type="text"
                  placeholder="Search by Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="searchLocation">
                <Form.Control
                  type="text"
                  placeholder="Search by City"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Display filtered doctors */}
        <Row>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <Col md={4} lg={3} key={index}>
                <Link to={`/dentist/${doctor._id}/reviews`}>
                  <Card className="appointment-card">
                    <Card.Img
                      variant="top"
                      src={`${doctor.profile_img}`}
                      alt={`${doctor.name} photo`}
                      className="doctor-image"
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="doctor-name">
                        Dr. {doctor.name}
                      </Card.Title>
                      <Card.Text className="doctor-city">
                        City: {doctor.hospital[0].city}
                      </Card.Text>

                      <Card.Text className="doctor-education">
                        Specialization: {doctor.specialization} <br />
                        Education: {doctor.education} <br />
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="mt-auto book-appointment-btn"
                        // onClick={() =>
                        //   navigate(`/appointment-booking/${doctor._id}`)
                        // }
                      >
                        Book Appointment
                      </Button>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <p>No doctors match the search criteria.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default AppointmentBookingCard;
