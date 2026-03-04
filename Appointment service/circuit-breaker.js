// appointment-service/circuit-breaker.js
import CircuitBreaker from "opossum";
import axios from "axios";

const defaultOptions = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
  volumeThreshold: 5,
};

// ─── DOCTOR ──────────────────────────────────────────────────────────────────
// Récupère un docteur par id (requiert token pour le middleware)
async function fetchDoctor(doctorId, authToken) {
  // authToken peut être undefined si l'appelant n'envoie rien
  const response = await axios.get(
    `${process.env.DOCTOR_SERVICE_URL}/api/doctors/${doctorId}`,
    { headers: { Authorization: authToken } },
  );
  // la route renvoie l'objet doctor directement
  return response.data ?? null;
}

// ─── BILLING ─────────────────────────────────────────────────────────────────
async function createBilling({
  patientId,
  appointmentId,
  doctorId,
  items,
  authToken,
}) {
  const response = await axios.post(
    `${process.env.BILLING_SERVICE_URL}/api/billing/create`,
    { patientId, appointmentId, doctorId, items },
    { headers: { Authorization: authToken } },
  );
  return response.data;
}

// ─── BREAKERS ────────────────────────────────────────────────────────────────
export const doctorBreaker = new CircuitBreaker(fetchDoctor, defaultOptions);
export const billingBreaker = new CircuitBreaker(createBilling, defaultOptions);

// ─── FALLBACKS ───────────────────────────────────────────────────────────────
// null → le controller fait : if (!doctor) pour détecter la panne
doctorBreaker.fallback(() => null);

billingBreaker.fallback((payload) => ({
  appointmentId: payload?.appointmentId,
  status: "indisponible",
  message: "Billing service unavailable",
}));

// ─── LOGS ────────────────────────────────────────────────────────────────────
[doctorBreaker, billingBreaker].forEach((breaker) => {
  breaker.on("open", () => console.warn(`[CB] OUVERT    — ${breaker.name}`));
  breaker.on("halfOpen", () =>
    console.info(` [CB] HALF-OPEN — ${breaker.name}`),
  );
  breaker.on("close", () => console.info(` [CB] FERMÉ     — ${breaker.name}`));
});
