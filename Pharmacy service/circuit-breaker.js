// pharmacy-service/circuit-breaker.js
import CircuitBreaker from "opossum";
import axios from "axios";

async function fetchPrescription({ prescriptionId, authToken }) {
  // ← objet avec les deux params
  const response = await axios.get(
    `${process.env.PRESCRIPTION_SERVICE_URL}/api/prescription/${prescriptionId}`,
    { headers: { Authorization: authToken } },
  );
  return response.data ?? null;
}

export const prescriptionBreaker = new CircuitBreaker(fetchPrescription, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
  volumeThreshold: 5,
});

// null → le controller fait : if (!prescription) pour détecter la panne
prescriptionBreaker.fallback(() => null);

prescriptionBreaker.on("open", () =>
  console.warn(`[CB] OUVERT    — prescription`),
);
prescriptionBreaker.on("halfOpen", () =>
  console.info(` [CB] HALF-OPEN — prescription`),
);
prescriptionBreaker.on("close", () =>
  console.info(`[CB] FERMÉ     — prescription`),
);
