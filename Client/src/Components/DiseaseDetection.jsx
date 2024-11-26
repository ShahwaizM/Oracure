import React, { useState } from "react";
import { Form, Button, Card, Container, Alert, Table } from "react-bootstrap";
import BrandLogo from "../Images/About.png"; // Import your brand logo
import "../Styles/DiseaseDetection.css";
import { Spin } from "antd";
import axios from "axios";
import backgroundImage from "../Images/dd5.png"; // Background image

const DiseaseDetection = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]); // Update to store array of results
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState(""); // For error handling

  // Remedies for each disease
  const remedies = {
    caries: [
      "*Note: Caries cannot be removed at home; a visit to the dentist is needed.",
      "Use of fluoride toothpaste (like Sensodyne Rapid Action)",
      "Use of clove oil or clove",
      "Garlic",
      "Mouthwashes",
      "Brushing teeth before going to bed at night and after breakfast in the morning",
    ],
    calculus: [
      "*Note: Calculus cannot be removed at home; ultrasonic scaling from a dentist is required.",
      "Improve oral hygiene by brushing twice a day",
      "Use of mouthwash",
      "Warm saline rinses to control further deposits",
    ],
    gingivitis: [
      "Brush twice a day",
      "Use mouthwash",
      "Warm saline rinses 2-3 times a day",
    ],
    toothDiscoloration: [
      "Maintain proper hygiene measures",
      "Brush twice a day",
      "Use activated charcoal toothpaste",
      "Warm saline rinses",
      "Avoid excessive soft drinks, tea, coffee",
      "Maintain proper hydration",
    ],
    ulcer: [
      "Use antiseptic soothing gel like Somogel",
      "Warm saline rinses",
      "Take a bland diet",
      "Maintain proper hydration",
    ],
    hypodontia: ["No specific home remedies available."],
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a URL for the selected image file
    const objectURL = URL.createObjectURL(selectedFile);
    setImageURL(objectURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure a file is selected before submitting
    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setError(""); // Reset error message

      // Make request to the backend

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Process response data
      const { predicted_classes, probabilities } = response.data;

      const predictions = predicted_classes.map((disease, index) => ({
        disease,
        probability: probabilities[index],
      }));

      setResult(predictions); // Set the array of predictions
      setLoading(false);
    } catch (error) {
      console.error("Error predicting disease:", error);
      setLoading(false);
      setError(
        "Error occurred while predicting the disease. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        height: "auto",
        minHeight: "100vh",
        paddingTop: "8%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="align-items-center justify-content-center"
    >
      <Card
        className="text-center p-4 shadow-lg"
        style={{
          maxWidth: "400px",
          width: "100%",
          margin: "0 auto",
          height: "auto",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
          border: "3px solid #00d1ff",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(5px)",
        }}
      >
        <Card.Body>
          <div
            className="canvas-container mb-4"
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "transparent",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {imageURL ? (
              <img
                src={imageURL}
                alt="Uploaded"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <img
                src={BrandLogo}
                alt="Brand Logo"
                style={{ maxHeight: "80%", maxWidth: "80%", opacity: 0.5 }}
              />
            )}
          </div>
          {error && <Alert variant="danger">{error}</Alert>}{" "}
          {/* Display errors */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 mb-3"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spin /> : "Identify Disease"}
            </Button>
          </Form>
          {loading ? (
            <Spin />
          ) : result.length > 0 ? (
            <>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((item, index) => (
                    <tr key={index}>
                      <td>{item.disease}</td>
                      <td>{(item.probability * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="p-3 bg-white">
                <h5 style={{ color: "Orange" }}>Home Remedies:</h5>
                {result.map((item, index) => (
                  <div className="text-start " key={index}>
                    <h5>{item.disease}:</h5>

                    {remedies[item.disease]?.map((remedy, i) => (
                      <li key={i}>{remedy}</li>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Form.Control
              type="text"
              placeholder="No Prediction Yet"
              value=""
              readOnly
              style={{ textAlign: "center", fontWeight: "bolder" }}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DiseaseDetection;
