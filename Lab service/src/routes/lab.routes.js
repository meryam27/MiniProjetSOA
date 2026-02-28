import {
  createLabReport,
  getLabReportById,
  getPatientLabReports,
  deleteLabReport,
  addLabResult,
} from "../controllers/lab.controller.js";

import express from "express";
import dotenv from "dotenv";
import { verifyToken } from "../middlewares/authMiddleware.js";
dotenv.config();

export const router = express.Router();

router.post("/create", verifyToken, createLabReport);
router.get("/patient/:patientId", verifyToken, getPatientLabReports);
router.get("/:id", verifyToken, getLabReportById);
router.put("/result/:id", verifyToken, addLabResult);
router.delete("/delete/:id", verifyToken, deleteLabReport);
