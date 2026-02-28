import { Billing } from "../models/billing.model.js";

export const createBill = async (req, res) => {
  try {
    const { role } = req.user;

    // doctor et admin créent manuellement
    // patient autorisé car l'appel vient de appointment-service (appel interne)
    if (role !== "doctor" && role !== "admin" && role !== "patient") {
      return res.status(403).json({ message: "access denied" });
    }

    // vérifier qu'une facture n'existe pas déjà pour ce RDV
    const existing = await Billing.findOne({
      appointmentId: req.body.appointmentId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "a bill already exists for this appointment" });
    }

    // calculer le total automatiquement depuis les items
    const totalAmount = req.body.items.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    // doctor → son propre ID | admin ou appel interne → doctorId vient du body
    const doctorId = role === "doctor" ? req.user.id : req.body.doctorId;
    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const bill = await Billing.create({
      ...req.body,
      doctorId,
      totalAmount, // calculé côté serveur, jamais pris du body
      status: "unpaid",
    });

    res.status(201).json(bill);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/billing/all → toutes les factures (admin seulement)
export const getAllBills = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "only admin can see all bills" });
    }
    const bills = await Billing.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/billing/patient/:patientId
export const getPatientBills = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role === "admin") {
      const bills = await Billing.find({
        patientId: req.params.patientId,
      }).sort({ createdAt: -1 });
      return res.status(200).json(bills);
    }

    if (role === "patient") {
      if (id !== req.params.patientId) {
        return res.status(403).json({ message: "access denied" });
      }
      const bills = await Billing.find({ patientId: id }).sort({
        createdAt: -1,
      });
      return res.status(200).json(bills);
    }

    if (role === "doctor") {
      const bills = await Billing.find({
        patientId: req.params.patientId,
        doctorId: id,
      }).sort({ createdAt: -1 });
      return res.status(200).json(bills);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/billing/:id
export const getBillById = async (req, res) => {
  try {
    const { role, id } = req.user;

    const bill = await Billing.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "bill not found" });
    }

    if (role === "admin") return res.status(200).json(bill);

    if (role === "patient") {
      if (bill.patientId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(bill);
    }

    if (role === "doctor") {
      if (bill.doctorId.toString() !== id.toString()) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.status(200).json(bill);
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/billing/pay/:id → patient ou admin
export const payBill = async (req, res) => {
  try {
    const { role, id } = req.user;

    const bill = await Billing.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "bill not found" });
    }

    if (bill.status === "paid") {
      return res.status(400).json({ message: "bill already paid" });
    }

    if (bill.status === "cancelled") {
      return res.status(400).json({ message: "cannot pay a cancelled bill" });
    }

    if (role === "doctor") {
      return res
        .status(403)
        .json({ message: "doctors cannot process payments" });
    }

    if (role === "patient" && bill.patientId.toString() !== id.toString()) {
      return res.status(403).json({ message: "access denied" });
    }

    const { paymentMethod } = req.body;
    if (!paymentMethod) {
      return res
        .status(400)
        .json({ message: "paymentMethod is required (cash, card, insurance)" });
    }

    const updated = await Billing.findByIdAndUpdate(
      req.params.id,
      { status: "paid", paymentMethod, paidAt: new Date() },
      { new: true },
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/billing/cancel/:id → admin seulement
export const cancelBill = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "only admin can cancel bills" });
    }

    const bill = await Billing.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "bill not found" });
    }

    if (bill.status === "paid") {
      return res.status(400).json({ message: "cannot cancel a paid bill" });
    }

    const updated = await Billing.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/billing/delete/:id → admin seulement
export const deleteBill = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "only admin can delete bills" });
    }

    const bill = await Billing.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "bill not found" });
    }

    res.status(200).json({ message: "bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
