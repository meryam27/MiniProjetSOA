import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "used", "cancelled"],
    },
  },
  {
    timestamps: true,
  },
);

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
