// pharmacy-service/controllers/pharmacy.controller.js
import { Pharmacy } from "../models/pharmacy.model.js";
import { prescriptionBreaker } from "../../circuit-breaker.js";

export const createPharmacyOrder = async (req, res) => {
  try {
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "only doctors and admins can create pharmacy orders",
      });
    }

    const existing = await Pharmacy.findOne({
      prescriptionId: req.body.prescriptionId,
    });
    if (existing) {
      return res.status(400).json({
        message: "a pharmacy order already exists for this prescription",
      });
    }

    // ✅ un seul argument objet avec les deux données nécessaires
    const prescription = await prescriptionBreaker.fire({
      prescriptionId: req.body.prescriptionId, // ← req.body pas req.user
      authToken: req.headers.authorization,
    });

    if (!prescription) {
      return res.status(404).json({
        message: "prescription not found or service unavailable",
      });
    }

    const order = await Pharmacy.create({
      ...req.body,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/pharmacy/patient/:patientId → historique des commandes d'un patient
export const getPatientOrders = async (req, res) => {
  try {
    const { role, id } = req.user;

    // admin → tout voir
    if (role === "admin") {
      const orders = await Pharmacy.find({
        patientId: req.params.patientId,
      }).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // patient → seulement ses propres commandes
    if (role === "patient") {
      if (id !== req.params.patientId) {
        return res.status(403).json({ message: "access denied" });
      }
      const orders = await Pharmacy.find({ patientId: id }).sort({
        createdAt: -1,
      });
      return res.status(200).json(orders);
    }

    // doctor → seulement les commandes liées à ses prescriptions
    if (role === "doctor") {
      const orders = await Pharmacy.find({
        patientId: req.params.patientId,
      }).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pharmacy/all → toutes les commandes (admin seulement)
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "only admin can see all orders" });
    }

    const orders = await Pharmacy.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pharmacy/:id → détail d'une commande
export const getOrderById = async (req, res) => {
  try {
    const { role, id } = req.user;

    const order = await Pharmacy.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "pharmacy order not found" });
    }

    // admin → accès total
    if (role === "admin") return res.status(200).json(order);

    // patient → seulement si c'est sa commande
    if (role === "patient") {
      if (order.patientId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(order);
    }

    // doctor → peut voir
    if (role === "doctor") {
      return res.status(200).json(order);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/pharmacy/status/:id → mettre à jour le statut
export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admin can update order status" });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const validStatuses = ["pending", "preparing", "ready", "dispensed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updateData = { status };

    // si dispensed → on enregistre la date de remise
    if (status === "dispensed") {
      updateData.dispensedAt = new Date();
    }

    const order = await Pharmacy.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: "pharmacy order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/pharmacy/delete/:id → admin seulement
export const deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admin can delete pharmacy orders" });
    }

    const order = await Pharmacy.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "pharmacy order not found" });
    }

    res.status(200).json({ message: "pharmacy order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
