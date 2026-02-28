import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3003;
connectDB().then(() => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
