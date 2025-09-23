export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const api = (path = "") =>
  `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
