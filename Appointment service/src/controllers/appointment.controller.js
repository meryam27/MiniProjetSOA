import { Appointment } from "../models/appointment.model.js";
import axios from "axios";

export const createAppointment = async (req, res) => {
  let appointment = null;

  try {
    if (req.user.role !== "patient") {
      return res
        .status(403)
        .json({ message: "only patients can create appointments" });
    }

    // 1. créer le RDV
    appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId: req.body.doctorId,
      date: req.body.date,
      time: req.body.time,
      reason: req.body.reason,
      status: "pending",
    });

    // 2. notifier billing-service automatiquement
    await axios.post(
      `${process.env.BILLING_SERVICE_URL}/api/billing/create`,
      {
        patientId: appointment.patientId.toString(),
        appointmentId: appointment._id.toString(),
        doctorId: appointment.doctorId.toString(),
        items: [
          {
            description: "Consultation fee",
            amount: 200,
          },
        ],
      },
      {
        headers: { Authorization: req.headers.authorization },
      },
    );

    res.status(201).json({
      appointment,
      message: "Appointment created and bill generated successfully",
    });
  } catch (error) {
    // si billing échoue → annuler le RDV pour garder la cohérence
    if (appointment) {
      await Appointment.findByIdAndDelete(appointment._id);
    }
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// get appointments of the patient or doctor
export const getMyAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "patient") {
      filter.patientId = req.user.id;
    } else if (req.user.role === "doctor") {
      filter.doctorId = req.user.id;
    } else {
      return res.status(403).json({ message: "access denied" });
    }
    const appointments = await Appointment.find(filter);
    res.status(200).json(appointments);
    console.log("appointments found for id :", req.user.id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// cancel or update only by admin

export const updateAppointment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "access denied" });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "appointment not found" });
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete appointment only by admin

export const deleteAppointment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "access denied" });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "appointment not found" });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
