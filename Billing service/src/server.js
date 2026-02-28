import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3009;

connectDB().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Billing service running on port ${PORT}`);
  });
});
