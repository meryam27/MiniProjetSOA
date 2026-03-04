import dotenv from "dotenv";
import { router } from "./routes/med-record.routes.js";
import express from "express";
import cors from "cors";
dotenv.config();
export const app = express();

app.use(express.json());
app.use(cors());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/medrecords", router);
