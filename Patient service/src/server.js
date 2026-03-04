import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { registerService } from "../consul-register.js";
dotenv.config();

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
  console.log("connected to database");
  app.listen(PORT, async () => {
    console.log(`Patient service is running on port ${PORT}`);
    await registerService();
  });
});
