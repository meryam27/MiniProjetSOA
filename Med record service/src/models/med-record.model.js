import mongoose from "mongoose";
// chaque consultation est lié à un dissier médicale crée par le médecin
const medRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  symptoms: {
    type: [String], // ["fièvre", "toux", "fatigue"]
    required: true,
  },
  diagnosis: {
    type: String, // "Grippe saisonnière"
    required: true,
  },
  treatment: {
    type: String, // "Repos, hydratation, paracétamol"
    required: true,
  },
  notes: {
    type: String, // notes supplémentaires du médecin
    default: "",
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId, // lien vers prescription-service
    default: null,
  },
  labReportId: {
    type: mongoose.Schema.Types.ObjectId, // lien vers lab-service
    default: null,
  },

  visitDate: {
    type: Date,
    default: Date.now,
  },
});
export const MedRecord = mongoose.model("MedRecord", medRecordSchema);
