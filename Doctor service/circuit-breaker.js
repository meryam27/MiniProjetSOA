import CircuitBreaker from "opossum";
import axios from "axios";

const defaultOptions = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimout: 10000,
  volumeThreshold: 5,
};
