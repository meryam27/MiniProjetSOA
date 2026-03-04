import express from "express";
import cors from "cors";

import router from "./routes/prescription.routes.js";

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
app.use("/api/prescription", router);
