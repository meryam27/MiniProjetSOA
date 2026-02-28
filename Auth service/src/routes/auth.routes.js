import { verifyToken } from "../../../Prescription service/src/middlewares/auth.middleware.js";
import { register, login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import express from "express";
import User from "../models/user.model.js";
export const router = express.Router();
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();
router.post("/register", register);

router.post("/login", login);

router.get("/verify", authMiddleware, (req, res) => {
  res.json({ message: "token is valid", user: req.user });
  console.log("JWT user in verify route:", req.user.email);
});

// endpoint spéciale pour doctor service

router.post("/register-doctor", verifyToken, async (req, res) => {
  try {
    const { email, password, role, id } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "email already exists" });
    }

    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      role: "doctor", // forcé, jamais pris du body
      doctorId: id, // référence vers doctor-service
      // mustChangePassword: true,  forcé à changer au 1er login
    });

    res.status(201).json({ id: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
