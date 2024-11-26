import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner"; // Your spinner component
const serverUrl = import.meta.env.VITE_SERVER_URL;

const PatientRoute = () => {
  const [isPatient, setIsPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPatient = async () => {
      const token = localStorage.getItem("token"); // Adjust if you store the token differently
      if (!token) {
        setIsPatient(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(serverUrl + "/auth/patient-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.ok) {
          setIsPatient(true);
        } else {
          setIsPatient(false);
        }
      } catch (error) {
        console.error("Patient check failed:", error);
        setIsPatient(false);
      } finally {
        setLoading(false);
      }
    };

    checkPatient();
  }, []);

  if (loading) {
    return <Spinner />; // Show a loading spinner while checking
  }

  return isPatient ? <Outlet /> : <Navigate to="/login" />; // Redirect if not Patient
};

export default PatientRoute;
