import { MedRecord } from "../models/med-record.model.js";
export const createMedRecord = async (req, res) => {
  try {
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "only doctors and admins can create medical records",
      });
    }

    // si c'est un doctor → doctorId = son propre ID (extrait du token)
    // si c'est un admin  → doctorId doit venir du body (il précise quel médecin)
    const doctorId =
      req.user.role === "doctor" ? req.user.id : req.body.doctorId;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const record = await MedRecord.create({
      ...req.body,
      doctorId,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/medrecords/patient/:patientId
export const getPatientRecords = async (req, res) => {
  try {
    const { role, id } = req.user;

    // admin → voit tous les dossiers du patient sans restriction
    if (role === "admin") {
      const records = await MedRecord.find({
        patientId: req.params.patientId,
      }).sort({ visitDate: -1 });
      return res.status(200).json(records);
    }

    // patient → seulement ses propres dossiers
    if (role === "patient") {
      if (id !== req.params.patientId) {
        return res.status(403).json({ message: "access denied" });
      }
      const records = await MedRecord.find({ patientId: id }).sort({
        visitDate: -1,
      });
      return res.status(200).json(records);
    }

    // doctor → seulement les dossiers qu'il a lui-même créés pour ce patient
    if (role === "doctor") {
      const records = await MedRecord.find({
        patientId: req.params.patientId,
        doctorId: id,
      }).sort({ visitDate: -1 });
      return res.status(200).json(records);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/medrecords/:id
export const getMedRecordById = async (req, res) => {
  try {
    const { role, id } = req.user; // ← manquait dans ton code

    const record = await MedRecord.findById(req.params.id); // ← findById prend un ID, pas un filtre
    if (!record) {
      return res.status(404).json({ message: "medical record not found" });
    }

    // admin → accès total
    if (role === "admin") {
      return res.status(200).json(record);
    }

    // patient → seulement si c'est son dossier
    if (role === "patient") {
      if (record.patientId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(record);
    }

    // doctor → seulement s'il a créé ce dossier
    if (role === "doctor") {
      if (record.doctorId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(record);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/medrecords/update/:id
export const updateMedRecord = async (req, res) => {
  try {
    const { role, id } = req.user;

    const record = await MedRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "medical record not found" });
    }

    // admin → peut modifier n'importe quel dossier
    if (role === "admin") {
      const updated = await MedRecord.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      return res.status(200).json(updated);
    }

    // doctor → seulement s'il a créé ce dossier
    if (role === "doctor") {
      if (record.doctorId.toString() !== id.toString()) {
        return res
          .status(403)
          .json({ message: "you can only update records you created" });
      }
      const updated = await MedRecord.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      return res.status(200).json(updated);
    }

    // patient → ne peut pas modifier
    return res
      .status(403)
      .json({ message: "only doctors and admins can update medical records" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/medrecords/delete/:id → admin seulement (pas de changement)
export const deleteMedRecord = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admin can delete medical records" });
    }

    const record = await MedRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "medical record not found" });
    }

    res.status(200).json({ message: "medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
