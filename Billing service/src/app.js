import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import { router } from "./routes/billing.routes.js";

export const app = express();
// cors un middleware pour permettre les requêtes cross-origin (origin par exemple : http://localhost:3000 : combinaison de protocole + domaine + port) sans lui un backend ne peut pas par exemple accéder a un frontend
app.use(cors());

app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/billing", router);
