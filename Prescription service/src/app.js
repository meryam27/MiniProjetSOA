import express from "express";
import cors from "cors";

import router from "./routes/prescription.routes.js";

export const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/prescription", router);
