import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { registerService } from "../consul-register.js";
dotenv.config();
const PORT = process.env.PORT || 3004;
connectDB().then(() => {
  console.log("connected to database");
  app.listen(PORT, async () => {
    console.log(`Patient service is running on port ${PORT}`);
    await registerService();
  });
});
