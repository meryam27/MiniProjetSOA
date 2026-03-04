import dotenv from "dotenv";
import { router } from "../src/routes/doctor.routes.js";
import express from "express";
import cors from "cors";
dotenv.config();

export const app = express();
app.use(cors());

app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/doctors", router);
