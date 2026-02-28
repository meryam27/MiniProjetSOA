import {
  getPatientProfile,
  createPatient,
} from "../controllers/patient.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, createPatient);
router.get("/profile", verifyToken, getPatientProfile);

export default router;
