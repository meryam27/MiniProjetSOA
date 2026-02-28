// lab-report.model.js
import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
  {
    // références vers les autres services
    patientId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true, // le médecin qui a demandé les analyses
    },
    medRecordId: {
      type: String,
      required: true, // lié au dossier médical de la consultation
    },

    // contenu du rapport
    testType: {
      type: String,
      required: true,
      enum: [
        "blood_test", // analyse de sang
        "urine_test", // analyse d'urine
        "xray", // radiographie
        "mri", // IRM
        "ecg", // électrocardiogramme
        "ultrasound", // échographie
        "biopsy", // biopsie
        "other",
      ],
    },
    testDetails: {
      type: String,
      required: true, // description de ce qui est analysé
    },
    results: {
      type: String,
      default: null, // null tant que le labo n'a pas rendu les résultats
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    reportDate: {
      type: Date,
      default: null, // date à laquelle les résultats sont rendus
    },
  },
  { timestamps: true },
);

export const LabReport = mongoose.model("LabReport", labReportSchema);

// POST   /api/lab/create              → doctor ou admin crée la demande d'analyse
// GET    /api/lab/patient/:patientId  → historique des analyses d'un patient
// GET    /api/lab/:id                 → détail d'un rapport spécifique
// PUT    /api/lab/result/:id          → le labo entre les résultats (status → completed)
// DELETE /api/lab/delete/:id          → admin seulement
