import app from "./app.js";
import { connectDB } from "./config/db.js";
import { registerService } from "../consul-register.js";

import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3003;
connectDB().then(() => {
  try {
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
      await registerService();
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
