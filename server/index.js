import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import nodemailer from "nodemailer";
//configure env
dotenv.config();

//databse config
connectDB();
// Configure Cloudinary

//rest object
const app = express();

app.use(
  cors({
    origin: "https://oracure.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());

//routes
app.use("/auth", authRoutes);

//rest api
app.post("/upload", async (req, res) => {
  const imageFilePath = req.file.path;
  try {
    const imageUrl = await uploadImage(imageFilePath);
    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/", (req, res) => {
  res.send("<h1>Welcome to OraCure App</h1>");
});

//PORT
const PORT = process.env.PORT || 5000;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
