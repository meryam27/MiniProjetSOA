import mongoose from "mongoose";

// juste les informations techniques  de base pour l'authentification, les autres infos seront dans les autres services

export const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "pharmacist", "lab", "admin"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
