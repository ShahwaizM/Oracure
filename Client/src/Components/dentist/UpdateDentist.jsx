import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const DentistUpdateForm = () => {
  const id = localStorage.getItem("id");
  const [profile_img, setprofile_img] = useState("");
  const [doctorData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    designation: "",
    education: "",
    bds_no: "",
    fee: "",
  });

  // Fetch dentist data to prefill the form
  useEffect(() => {
    const fetchDentistDetails = async () => {
      try {
        const response = await axios.get(`${serverUrl}/auth/getDentist/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching dentist details", error);
      }
    };

    fetchDentistDetails();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...doctorData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    Object.keys(doctorData).forEach((key) => {
      formData.append(key, doctorData[key]);
    });
    if (profile_img) {
      formData.append("profile_img", profile_img);
    }

    // Log each key-value pair in the FormData object for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // Axios will automatically set the appropriate headers for FormData
      await axios.put(`${serverUrl}/auth/doctors/${id}`, formData);
      toast.success("Dentist details updated successfully");
    } catch (error) {
      console.error("Error updating dentist details", error);
      toast.error("Failed to update dentist details.");
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">Update Your Details</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={doctorData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={doctorData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={doctorData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Specialization:</label>
          <input
            type="text"
            name="specialization"
            className="form-control"
            value={doctorData.specialization}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Designation:</label>
          <input
            type="text"
            name="designation"
            className="form-control"
            value={doctorData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Education:</label>
          <input
            type="text"
            name="education"
            className="form-control"
            value={doctorData.education}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">BDS Number:</label>
          <input
            type="text"
            name="bds_no"
            className="form-control"
            value={doctorData.bds_no}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fee:</label>
          <input
            type="text"
            name="fee"
            className="form-control"
            value={doctorData.fee}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Profile Image:</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) => setprofile_img(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Update Details
        </button>
      </form>
    </div>
  );
};

export default DentistUpdateForm;
