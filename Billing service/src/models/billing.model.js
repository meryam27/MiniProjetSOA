// billing.model.js
import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    // références
    patientId: {
      type: String,
      required: true,
    },
    appointmentId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },

    // détail des frais
    items: [
      {
        description: { type: String, required: true }, // "Consultation", "Analyse sang"
        amount: { type: Number, required: true }, // 150.00
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["unpaid", "paid", "cancelled"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "insurance", null],
      default: null, // null tant que pas payé
    },

    paidAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const Billing = mongoose.model("Billing", billingSchema);
