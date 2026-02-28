import mongoose from "mongoose";
// a chercher plus tard : doctor et patient dans les microservices respectifs
const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      //type: String, juste pour tester avant de créer le service doctor
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
