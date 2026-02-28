// pharmacy.model.js
import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    // références
    patientId: {
      type: String,
      required: true,
    },
    prescriptionId: {
      type: String,
      required: true,
      unique: true, // une prescription = une commande pharmacie
    },

    // médicaments
    medications: [
      {
        name: { type: String, required: true }, // "Paracétamol"
        dosage: { type: String },
        quantity: { type: Number, required: true },
        frequency: { type: String }, // "2 fois par jour"
      },
    ],

    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "dispensed"],
      default: "pending",
    },

    notes: {
      type: String,
      default: "",
    },

    dispensedAt: {
      type: Date,
      default: null, // date à laquelle les médicaments ont été remis au patient
    },
  },
  { timestamps: true },
);

export const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
