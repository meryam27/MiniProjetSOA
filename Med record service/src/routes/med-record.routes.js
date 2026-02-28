import express from "express";
import dotenv from "dotenv";
import {
  createMedRecord,
  getMedRecordById,
  getPatientRecords,
  updateMedRecord,
  deleteMedRecord,
} from "../contorllers/med-record.controller.js";
import { verifyToken } from "../milldewares/authMiddleware.js";
dotenv.config();
export const router = express.Router();

router.post("/create", verifyToken, createMedRecord);
router.get("/patient/:patientId", verifyToken, getPatientRecords);
router.get("/:id", verifyToken, getMedRecordById);
router.put("/update/:id", verifyToken, updateMedRecord);
router.delete("/delete/:id", verifyToken, deleteMedRecord);
