import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 3005;

connectDB().then(() => {
  console.log("connected to database");
  app.listen(PORT, () => {
    console.log(`Patient service is running on port ${PORT}`);
  });
});
