import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSignUp from "./Components/UserSignUp";
import Login from "./Components/Login";
import DoctorSignUp from "./Components/DoctorSignUp";
import HomePage from "./Components/HomePage";
import About from "./Components/About";
import DiseaseDetection from "./Components/DiseaseDetection";
import DiseaseDetectionPage from "./Components/DiseaseDetectionPage";
import PreSignUpPage from "./Components/PreSignUpPage";
import AppointmentBookingPage from "./Components/AppointmetBookingPage";
import { Toaster } from "react-hot-toast";
import Doctor_Dashboard from "./Components/dentist/availibility";
import Page404 from "./Components/Page404";
import AppointmentBooking from "./Components/BookAppointment";
import DoctorAppointments from "./Components/dentist/DentistAppointments";
import PatientAppointments from "./Components/patient/PatientAppointments";
import DentistProfile from "./Components/DoctorProfile";
import AddReview from "./Components/patient/AddReview";
import ForgotPassword from "./Components/Forgotpass";
import VerifyOTP from "./Components/OtpVerify";
import PatientUpdateForm from "./Components/patient/UpdatePatient";
import DentistUpdateForm from "./Components/dentist/UpdateDentist";
import MainLayout from "./Components/admin/MainLayout";
import Dashboard from "./Components/admin/Dashboard";
import Hospitals from "./Components/admin/Hospitals";
import Users from "./Components/admin/Users";
import Appointments from "./Components/admin/Appointment";
import DeleteUsers from "./Components/admin/DeleteUsers";
import "./App.css";
import AdminRoute from "./Routes/adminRoute";
import PMainLayout from "./Components/patient/MainLayout";
import DMainLayout from "./Components/dentist/MainLayout";
import DentistRoute from "./Routes/DprivateRoute";
import PatientRoute from "./Routes/PprivateRoute";
import SetAvailability from "./Components/dentist/availibility";
import DentistReviews from "./Components/dentist/reviews";
import CompletedAppointments from "./Components/patient/completedAppointments";
import PatientDashboard from "./Components/patient/dashboard";
import DentistDashboard from "./Components/dentist/dashboard";
function App() {
  return (
    <>
      <Toaster />

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/UserSignUp" element={<UserSignUp />} />
          <Route path="/DoctorSignUp" element={<DoctorSignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/DiseaseDetection" element={<DiseaseDetection />} />
          <Route path="/PreSignUpPage" element={<PreSignUpPage />} />
          <Route
            path="/DiseaseDetectionPage"
            element={<DiseaseDetectionPage />}
          />

          <Route
            path="/dentist/:dentistId/reviews"
            element={<DentistProfile />}
          />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="hospitals" element={<Hospitals />} />
              <Route path="users" element={<Users />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="delete" element={<DeleteUsers />} />
            </Route>
          </Route>

          <Route element={<DentistRoute />}>
            <Route path="/dentist" element={<DMainLayout />}>
              <Route path="dashboard" element={<DentistDashboard />} />
              <Route path="set-availability" element={<SetAvailability />} />
              <Route path="update-details" element={<DentistUpdateForm />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="reviews" element={<DentistReviews />} />
            </Route>
          </Route>
          <Route path="/About" element={<About />} />

          <Route element={<PatientRoute />}>
            <Route
              path="/AppointmentBookingPage"
              element={<AppointmentBookingPage />}
            />
            <Route
              path="/appointment-booking/:id"
              element={<AppointmentBooking />}
            />
            <Route path="/patient" element={<PMainLayout />}>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="Appointments" element={<PatientAppointments />} />
              <Route path="add-review/:appointmentId" element={<AddReview />} />
              <Route path="add-review" element={<CompletedAppointments />} />
              <Route path="update-profile" element={<PatientUpdateForm />} />
            </Route>
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
