const API_BASE =
  (import.meta.env.VITE_API_BASE?.replace(/\/$/, "")) ||
  "https://tapako-backend.vercel.app/api";

async function handleResponse(res) {
  if (res.ok) {
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; }
    catch { return { raw: text }; }
  }
  let errPayload = {};
  try { errPayload = await res.json(); } catch {}
  const error = new Error(errPayload?.error || `Request failed: ${res.status}`);
  error.status = res.status;
  error.payload = errPayload;
  throw error;
}

const api = {
  baseURL: API_BASE,
  get: async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    return handleResponse(res);
  },
  post: async (path, body, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      body: JSON.stringify(body),
      ...options
    });
    return handleResponse(res);
  },
  put: async (path, body, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      body: JSON.stringify(body),
      ...options
    });
    return handleResponse(res);
  },
  delete: async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    return handleResponse(res);
  }
};

export default api;
export const apiGet = api.get;
export const apiPost = api.post;
export const apiPut = api.put;
export const apiDelete = api.delete;
