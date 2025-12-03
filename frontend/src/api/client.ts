// frontend/src/api/client.ts
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: false,
});
