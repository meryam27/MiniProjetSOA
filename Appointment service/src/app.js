import express from "express";
import dotenv from "dotenv";
import appointmentsRoutes from "./routes/appointment.routes.js";
dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/appointments", appointmentsRoutes);

export default app;
