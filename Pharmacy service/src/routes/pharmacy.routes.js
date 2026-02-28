// pharmacy.routes.js
import express from "express";
import {
  createPharmacyOrder,
  getPatientOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/pharmacy.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
export const router = express.Router();

router.post("/create", verifyToken, createPharmacyOrder);
router.get("/all", verifyToken, getAllOrders);
router.get("/patient/:patientId", verifyToken, getPatientOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/status/:id", verifyToken, updateOrderStatus);
router.delete("/delete/:id", verifyToken, deleteOrder);
