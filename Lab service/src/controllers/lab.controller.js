// lab.controller.js
import { LabReport } from "../models/lab.model.js";

// POST /api/lab/create → doctor ou admin
export const createLabReport = async (req, res) => {
  try {
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only doctors and admins can request lab tests" });
    }

    const doctorId =
      req.user.role === "doctor" ? req.user.id : req.body.doctorId;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const report = await LabReport.create({
      ...req.body,
      doctorId, // priorité à notre valeur contrôlée
      status: "pending", // toujours pending à la création
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/lab/patient/:patientId
export const getPatientLabReports = async (req, res) => {
  try {
    const { role, id } = req.user;

    // admin → tout voir
    if (role === "admin") {
      const reports = await LabReport.find({
        patientId: req.params.patientId,
      }).sort({ createdAt: -1 });
      return res.status(200).json(reports);
    }

    // patient → seulement ses propres analyses
    if (role === "patient") {
      if (id !== req.params.patientId) {
        return res.status(403).json({ message: "access denied" });
      }
      const reports = await LabReport.find({ patientId: id }).sort({
        createdAt: -1,
      });
      return res.status(200).json(reports);
    }

    // doctor → seulement ceux qu'il a demandés
    if (role === "doctor") {
      const reports = await LabReport.find({
        patientId: req.params.patientId,
        doctorId: id,
      }).sort({ createdAt: -1 });
      return res.status(200).json(reports);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/lab/:id
export const getLabReportById = async (req, res) => {
  try {
    const { role, id } = req.user;

    const report = await LabReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "lab report not found" });
    }

    if (role === "admin") return res.status(200).json(report);

    if (role === "patient") {
      if (report.patientId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(report);
    }

    if (role === "doctor") {
      if (report.doctorId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(report);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/lab/result/:id → le labo entre les résultats
export const addLabResult = async (req, res) => {
  try {
    // seul admin ou doctor peut entrer les résultats
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "access denied" });
    }

    const { results } = req.body;
    if (!results) {
      return res.status(400).json({ message: "results are required" });
    }

    const report = await LabReport.findByIdAndUpdate(
      req.params.id,
      {
        results,
        status: "completed",
        reportDate: new Date(),
      },
      { new: true },
    );

    if (!report) {
      return res.status(404).json({ message: "lab report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/lab/delete/:id → admin seulement
export const deleteLabReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admin can delete lab reports" });
    }

    const report = await LabReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "lab report not found" });
    }

    res.status(200).json({ message: "lab report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
