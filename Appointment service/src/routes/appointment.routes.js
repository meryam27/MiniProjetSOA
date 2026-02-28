import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  getMyAppointments,
} from "../controllers/appointment.controller.js";

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
export const router = express.Router();

// create appointment only by patient

router.post("/create", verifyToken, createAppointment);

// get appointments of the patient or doctor
router.get("/my-appointments", verifyToken, getMyAppointments);

//update an appointment only by admin

router.put("/update/:id", verifyToken, updateAppointment);

// delete an appointment only by admin
router.delete("/delete/:id", verifyToken, deleteAppointment);

export default router;
