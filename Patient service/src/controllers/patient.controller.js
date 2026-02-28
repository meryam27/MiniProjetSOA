import { Patient } from "../models/patient.model.js";

// create a  new patient

export const createPatient = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, phone } = req.body;
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "access denied" });
    }
    const existingPatient = await Patient.findOne({
      id: req.user.id,
    });
    if (existingPatient) {
      res.status(400).json({ message: "patient already exist" });
    }
    const patient = await Patient.create({
      _id: req.user.id,
      firstName,
      lastName,
      dateOfBirth,
      phone,
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get profile of the patient
export const getPatientProfile = async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "access denied" });
    }
    const patient = await Patient.findById(req.user.id);
    console.log("JWT user:", req.user);
    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
