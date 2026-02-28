//les endpoints : /create , /getAll , /getById , /update , /delete
import { Doctor } from "../models/doctor.model.js";
import bcrypt from "bcrypt";
import axios from "axios";
// create doctor profile by admin only
// export const createDoctor = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "only admins can create doctor profiles" });
//     }
//     const existingDoctor = await Doctor.findOne({ email: req.body.email });
//     if (existingDoctor) {
//       return res
//         .status(400)
//         .json({ message: "doctor with those credentials already exists" });
//     }
//     // création dans doctor service
//     const doctor = await Doctor.create(req.body);
//     // création dans auth service
//     await axios.post(
//       `${process.env.AUTH_SERVICE_URL}/auth/register-doctor`,
//       {
//         email: req.body.email,
//         password: "doctor123", // mot de passe temporaire
//         role: "doctor",
//         id: doctor._id, // lien entre les deux services
//       },
//       {
//         headers: { Authorization: req.headers.authorization }, // passe le token admin
//       },
//     );
//     res.status(201).json(doctor);
//   } catch (error) {
//     // si auth-service échoue, on supprime le doctor déjà créé (cohérence)
//     if (error.response) {
//       await Doctor.findByIdAndDelete(doctor?._id);
//     }
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const createDoctor = async (req, res) => {
  let doctor = null; // ← déclare la variable avant le try

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admins can create doctor profiles" });
    }

    const existingDoctor = await Doctor.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res.status(400).json({ message: "doctor already exists" });
    }

    doctor = await Doctor.create(req.body); // ← plus de const, on réutilise la variable du dessus

    await axios.post(
      `${process.env.AUTH_SERVICE_URL}/auth/register-doctor`,
      {
        email: req.body.email,
        password: "Doctor@1234",
        role: "doctor",
        id: doctor._id,
      },
      {
        headers: { Authorization: req.headers.authorization },
      },
    );

    res.status(201).json({
      doctor,
      message: "Doctor created. Temporary password: Doctor@1234",
    });
  } catch (error) {
    // maintenant doctor est accessible ici
    if (doctor) {
      // ← vérifie qu'il existe avant de supprimer
      await Doctor.findByIdAndDelete(doctor._id);
    }
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get doctor by id
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update doctor profile by admin only
export const updateDoctor = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admins can update doctor profiles" });
    }
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }
    return res.status(200).json({ message: "doctor updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a doctor only admin

export const deleteDoctor = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      res.status(401).json({ message: "only admin can do this operation" });
    }
    await Doctor.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
