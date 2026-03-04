import Consul from "consul";

const SERVICE_NAME = "patient-service"; // ← change par service
const SERVICE_PORT = 3002; // ← change par service
const SERVICE_ID = `${SERVICE_NAME}-${SERVICE_PORT}`;

const consul = new Consul({
  host: "127.0.0.1",
  port: 8500,
  promisify: true,
});

const serviceDefinition = {
  id: SERVICE_ID,
  name: SERVICE_NAME,
  address: "127.0.0.1",
  port: SERVICE_PORT,
  tags: ["microservice", "nodejs"],
  check: {
    http: `http://127.0.0.1:${SERVICE_PORT}/health`, // endpoint de santé
    interval: "10s", // vérifie toutes les 10 secondes
    timeout: "5s",
    deregistercriticalserviceafter: "30s", // désenregistre si down 30s
  },
};

async function registerService() {
  try {
    await consul.agent.service.register(serviceDefinition);
    console.log(` [Consul] ${SERVICE_NAME} enregistré avec succès`);
  } catch (err) {
    console.error(` [Consul] Erreur d'enregistrement:`, err.message);
  }
}

async function deregisterService() {
  try {
    await consul.agent.service.deregister(SERVICE_ID);
    console.log(` [Consul] ${SERVICE_NAME} désenregistré`);
  } catch (err) {
    console.error(` [Consul] Erreur de désenregistrement:`, err.message);
  }
}

// Désenregistre proprement lors de l'arrêt
process.on("SIGINT", async () => {
  await deregisterService();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await deregisterService();
  process.exit(0);
});

export { registerService, consul, SERVICE_NAME };
