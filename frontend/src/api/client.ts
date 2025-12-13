// src/api/client.ts
import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: false,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lg_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =======================
// RESPONSE INTERCEPTOR (🔥 THIS FIXES EVERYTHING)
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Prevent infinite loop
      if (window.location.pathname !== "/auth") {
        // Clear auth
        localStorage.removeItem("lg_token");
        localStorage.removeItem("lg_user");

        // Notify user
        toast.error("Session expired. Please login again.");

        // Redirect
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
