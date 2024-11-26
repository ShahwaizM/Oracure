import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner"; // Your spinner component
const serverUrl = import.meta.env.VITE_SERVER_URL;

const DentistRoute = () => {
  const [isDentist, setIsDentist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDentist = async () => {
      const token = localStorage.getItem("token"); // Adjust if you store the token differently
      if (!token) {
        setIsDentist(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(serverUrl + "/auth/dentist-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.ok) {
          setIsDentist(true);
        } else {
          setIsDentist(false);
        }
      } catch (error) {
        console.error("Dentist check failed:", error);
        setIsDentist(false);
      } finally {
        setLoading(false);
      }
    };

    checkDentist();
  }, []);

  if (loading) {
    return <Spinner />; // Show a loading spinner while checking
  }

  return isDentist ? <Outlet /> : <Navigate to="/login" />; // Redirect if not Dentist
};

export default DentistRoute;
