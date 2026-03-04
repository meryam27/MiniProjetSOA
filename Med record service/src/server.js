import { connectDB } from "./config/db.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 3006;
import { registerService } from "../consul-register.js";
connectDB().then(() => {
  try {
    console.log("mongodb connected");
    app.listen(PORT, async () => {
      console.log(`server running on port : ${PORT}`);
      await registerService();
    });
  } catch (error) {
    process.exit(1);
  }
});
