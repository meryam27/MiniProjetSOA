// billing.routes.js
import express from "express";
import {
  createBill,
  getAllBills,
  getPatientBills,
  getBillById,
  payBill,
  cancelBill,
  deleteBill,
} from "../controllers/billing.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const router = express.Router();

router.post("/create", verifyToken, createBill);
router.get("/all", verifyToken, getAllBills);
router.get("/patient/:patientId", verifyToken, getPatientBills);
router.get("/:id", verifyToken, getBillById);
router.put("/pay/:id", verifyToken, payBill);
router.put("/cancel/:id", verifyToken, cancelBill);
router.delete("/delete/:id", verifyToken, deleteBill);
