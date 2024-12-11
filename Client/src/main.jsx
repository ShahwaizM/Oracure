import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Services from "./Components/Services.jsx";
import About from "./Components/About.jsx";
import Footer from "./Components/Footer.jsx";
import DiseaseDetection from "./Components/DiseaseDetection.jsx";
// import App from './Components/App.jsx'
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

createRoot(document.getElementById("root")).render(<App />);
