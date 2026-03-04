import { Appointment } from "../models/appointment.model.js";
import axios from "axios";
import { billingBreaker, doctorBreaker } from "../../circuit-breaker.js";

export const createAppointment = async (req, res) => {
  let appointment = null;

  try {
    if (req.user.role !== "patient") {
      return res
        .status(403)
        .json({ message: "only patients can create appointments" });
    }

    const { doctorId, date, time, reason } = req.body;

    // ✅ Appel protégé par circuit breaker au lieu d'axios direct
    // Si doctor-service est down → le fallback retourne { available: false }
    const doctor = await doctorBreaker.fire(
      doctorId,
      req.headers.authorization,
    );

    // null = doctor pas trouvé OU service down (fallback)
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found or service unavailable",
      });
    }
    // 1. Créer le RDV
    appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason,
      status: "pending",
    });

    // 2. ✅ Notifier billing-service via circuit breaker
    // Si billing-service est down → fallback retourne { status: "indisponible" }
    const billing = await billingBreaker.fire({
      patientId: appointment.patientId.toString(),
      appointmentId: appointment._id.toString(),
      doctorId: appointment.doctorId.toString(),
      items: [{ description: "Consultation fee", amount: 200 }],
      // on passe le token dans l'objet car .fire() n'accepte qu'un seul argument
      authToken: req.headers.authorization,
    });

    // Si billing a échoué (fallback déclenché), on annule le RDV
    if (billing?.status === "indisponible") {
      await Appointment.findByIdAndDelete(appointment._id);
      return res.status(503).json({
        message: "Billing service unavailable. Appointment cancelled.",
      });
    }

    res.status(201).json({
      appointment,
      billing,
      message: "Appointment created and bill generated successfully",
    });
  } catch (error) {
    // Annuler le RDV si une erreur inattendue survient après sa création
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
