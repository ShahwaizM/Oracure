import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Rate } from "antd"; // Import Ant Design components
import "antd/dist/reset.css"; // Import Ant Design styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

const DentistReviews = () => {
  const navigate = useNavigate();
  const [dentist, setDentist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const dentistId = localStorage.getItem("id"); // Access the dentistId from localStorage

  useEffect(() => {
    const fetchDentistDetails = async () => {
      try {
        // Fetch dentist details
        const dentistResponse = await axios.get(
          `http://localhost:5000/auth/getDentist/${dentistId}`
        );
        setDentist(dentistResponse.data);

        // Fetch reviews with patient names
        const reviewsResponse = await axios.get(
          `http://localhost:5000/auth/dentist/${dentistId}/reviews`
        );

        console.log("Reviews response:", reviewsResponse.data.reviews); // Log the reviews response
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
    <div className="col">
      <h3>Reviews for {dentist.name}</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <Card key={index} className="mb-3">
            <h4>{review?.review?.title || "No Title"}</h4>{" "}
            <Rate disabled value={review?.review?.stars || 0} />{" "}
            <p>{review?.review?.comment || "No comment"}</p>{" "}
            <p>
              <strong>Patient:</strong> {review.patientName}
            </p>
          </Card>
        ))
      )}
    </div>
  );
};

export default DentistReviews;
