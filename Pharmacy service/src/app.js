import { router } from "./routes/pharmacy.routes.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { verifyToken } from "./middlewares/authMiddleware.js";
dotenv.config();

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/pharmacy", verifyToken, router);
