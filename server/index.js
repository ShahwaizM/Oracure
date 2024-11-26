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

//rest object
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static("uploads"));
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to OraCure App</h1>");
});

//PORT
const PORT = process.env.PORT || 5000;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
