import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Rate, Button } from "antd"; // Ant Design components
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap 5
const serverUrl = import.meta.env.VITE_SERVER_URL;

const AddReview = () => {
  const { appointmentId } = useParams(); // Get appointment ID from the URL

  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("token");
  const [comment, setComment] = useState("");
  const [Dentistname, setdata] = useState([]); // State for dentist's name
  const navigate = useNavigate();

  // Fetch appointment details to get the dentist's name
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/auth/getAPdetails/${appointmentId}`
        );
        setdata(response.data.dentistId.name);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Failed to fetch appointment details.");
      }
    };
    fetchAppointmentDetails();
  }, [appointmentId]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call to submit the review
      await axios.post(
        `${serverUrl}/auth/appointment/${appointmentId}/review`,
        {
          stars,
          title,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review posted!");
      navigate("/patient/appointments");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Review for Appointment with Dr {Dentistname}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <label htmlFor="stars" className="col-sm-2 col-form-label">
            Rating:
          </label>
          <div className="col-sm-10">
            <Rate
              id="stars"
              onChange={(value) => setStars(value)}
              value={stars}
              allowHalf
              className="fs-4"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="title" className="col-sm-2 col-form-label">
            Title:
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter review title"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="comment" className="col-sm-2 col-form-label">
            Comment:
          </label>
          <div className="col-sm-10">
            <textarea
              id="comment"
              className="form-control"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Write your review"
            ></textarea>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-10 offset-sm-2">
            <Button type="primary" htmlType="submit">
              Submit Review
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
