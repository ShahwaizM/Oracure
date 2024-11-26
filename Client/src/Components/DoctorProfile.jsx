import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Rate, Button } from "antd"; // Import Ant Design components
import "antd/dist/reset.css"; // Import Ant Design styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "../Styles/DoctorProfile.css";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const DentistProfile = () => {
  const navigate = useNavigate();
  const [dentist, setDentist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { dentistId } = useParams(); // Access the dentistId from the URL

  useEffect(() => {
    const fetchDentistDetails = async () => {
      try {
        const dentistResponse = await axios.get(
          `${serverUrl}/auth/getDentist/${dentistId}`
        );
        setDentist(dentistResponse.data);

        const reviewsResponse = await axios.get(
          `${serverUrl}/auth/dentist/${dentistId}/reviews`
        );
        setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        console.error("Error fetching dentist details and reviews:", error);
      }
    };
    fetchDentistDetails();
  }, [dentistId]);

  if (!dentist) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <Card className="dentist-profile-card" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-md-4 text-center">
            <img
              src={`${serverUrl}/uploads/${dentist.profile_img}`}
              alt={dentist.name}
              className="img-fluid DoctorImage rounded-circle mb-3"
              style={{ width: "150px", height: "150px" }}
            />
            <h2>Dr. {dentist.name}</h2>
            <p>
              <strong>Specialization:</strong> {dentist.specialization}
            </p>
            <p>
              <strong>Designation:</strong> {dentist.designation}
            </p>
            <p>
              <strong>Education:</strong> {dentist.education}
            </p>
            <p>
              <strong>Fees:</strong> ${dentist.fee}
            </p>
            <Button
              variant="primary"
              className="mt-auto book-appointment-btn"
              onClick={() => navigate(`/appointment-booking/${dentist._id}`)}
            >
              Book Appointment
            </Button>
          </div>
          <div className="col-md-8 ReviewCard">
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <Card key={index} className="mb-3 ReviewSubCard">
                  <h4>{review.review.title}</h4>
                  <Rate disabled value={review.review.stars} />
                  <p>{review.review.comment}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DentistProfile;
