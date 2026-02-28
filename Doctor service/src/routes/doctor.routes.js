import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
export const router = express.Router();

router.post("/create", verifyToken, createDoctor);
router.get("/", verifyToken, getAllDoctors);
router.get("/:id", verifyToken, getDoctorById);
router.put("/update/:id", verifyToken, updateDoctor);
router.delete("/delete/:id", verifyToken, deleteDoctor);
