import express from "express";
import cors from "cors";

import router from "./routes/patient.routes.js";

export const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/patient", router);
