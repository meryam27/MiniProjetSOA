import {
  createPrescription,
  getMyPrescription,
  getPerscriptionById,
} from "../controllers/prescreption.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, createPrescription);

router.get("/", verifyToken, getMyPrescription);

router.get("/:id", verifyToken, getPerscriptionById);
export default router;
