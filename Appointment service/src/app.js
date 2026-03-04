import express from "express";
import dotenv from "dotenv";
import appointmentsRoutes from "./routes/appointment.routes.js";
dotenv.config();
const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/appointments", appointmentsRoutes);

export default app;
