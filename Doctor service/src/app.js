import dotenv from "dotenv";
import { router } from "../src/routes/doctor.routes.js";
import express from "express";
import cors from "cors";
dotenv.config();

export const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/doctors", router);
