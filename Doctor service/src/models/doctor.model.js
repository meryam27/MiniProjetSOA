import mongoose from "mongoose";

export const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  availability: {
    type: [String],
    required: true,
  },
});

export const Doctor = mongoose.model("Doctor", doctorSchema);
