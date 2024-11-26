import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSignUp from "./UserSignUp";
import Login from "./Login";
import DoctorSignUp from "./DoctorSignUp";
import HomePage from "./HomePage";
import About from "./About";
import DiseaseDetection from "./DiseaseDetection";
import DiseaseDetectionPage from "./DiseaseDetectionPage";
import PreSignUpPage from "./PreSignUpPage";
import AppointmentBookingPage from "./AppointmetBookingPage";
import { Toaster } from "react-hot-toast";
import Doctor_Dashboard from "./dentist/availibility";
import Page404 from "./Page404";
import AppointmentBooking from "./BookAppointment";
import DoctorAppointments from "./dentist/DentistAppointments";
import PatientAppointments from "./patient/PatientAppointments";
import DentistProfile from "./DoctorProfile";
import AddReview from "./patient/AddReview";
import ForgotPassword from "./Forgotpass";
import VerifyOTP from "./OtpVerify";
import PatientUpdateForm from "./patient/UpdatePatient";
import DentistUpdateForm from "./dentist/UpdateDentist";
import MainLayout from "./admin/MainLayout";
import Dashboard from "./admin/Dashboard";
import Hospitals from "./admin/Hospitals";
import Users from "./admin/Users";
import Appointments from "./admin/Appointment";
import DeleteUsers from "./admin/DeleteUsers";
import "../App.css";
import AdminRoute from "../Routes/adminRoute";
import PMainLayout from "./patient/MainLayout";
import DMainLayout from "./dentist/MainLayout";
import DentistRoute from "../Routes/DprivateRoute";
import PatientRoute from "../Routes/PprivateRoute";
import SetAvailability from "./dentist/availibility";
import DentistReviews from "./dentist/reviews";
import CompletedAppointments from "./patient/completedAppointments";
import PatientDashboard from "./patient/dashboard";
import DentistDashboard from "./dentist/dashboard";
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
