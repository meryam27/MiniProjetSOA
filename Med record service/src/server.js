import { connectDB } from "./config/db.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 3006;
connectDB().then(() => {
  try {
    console.log("mongodb connected");
    app.listen(PORT, () => {
      console.log(`server running on port : ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
});
