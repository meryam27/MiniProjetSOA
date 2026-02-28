import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Prescription } from "../models/prescreption.model.js";

dotenv.config();
// create a prescription by a doctor

export const createPrescription = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "only doctors can create a prescription" });
    }
    const { patientId, appointmentId, description } = req.body;
    if (!patientId) {
      return res.status(400).json({ message: "some data are midding" });
    }
    const prescription = await Prescription.create({
      doctorId: req.user.id,
      patientId,
      appointmentId,
      description,
      status: "active",
    });
    return res.status(201).json(prescription);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

// GET prescription (doctor and patient)

export const getMyPrescription = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role == "patient") {
      filter.patientId = req.user.id;
    } else if (req.user.role == "doctor") {
      filter.doctorId = req.user.id;
    } else {
      return res.status(403).Json({ message: "access denied" });
    }
    const prescriptions = await Prescription.find(filter);
    res.status(200).json(prescriptions);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

// a faire plus tard endpoints pour : - cancel - delete - voir tous (admin)
