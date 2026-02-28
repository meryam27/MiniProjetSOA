import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// endpoint pour l'inscription

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    console.error("error in register controller:", error);
    res.status(500).json({ message: "server error" });
  }
};

// endpoint pour la connexion

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({ token, role: user.role, email: user.email, id: user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
