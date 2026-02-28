import dotenv from "dotenv";
import { router } from "./routes/lab.routes.js";
import express from "express";
import cors from "cors";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/lab", router);
