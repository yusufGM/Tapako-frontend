const RAW_BASE = import.meta.env.VITE_API_BASE || "https://tapako-backend.vercel.app";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

function joinURL(base, path) {
  if (!path) return base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

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

async function request(path, { method = "GET", headers = {}, body } = {}) {
  const url = joinURL(BASE_URL, path);
  const init = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  return handleResponse(res);
}

const api = {
  baseURL: BASE_URL,
  get: (path, options = {}) => request(path, { method: "GET", ...options }),
  post: (path, body, options = {}) => request(path, { method: "POST", body, ...options }),
  put: (path, body, options = {}) => request(path, { method: "PUT", body, ...options }),
  patch: (path, body, options = {}) => request(path, { method: "PATCH", body, ...options }),
  delete: (path, options = {}) => request(path, { method: "DELETE", ...options }),
};

export const apiGet = api.get;
export const apiPost = api.post;
export const apiPut = api.put;
export const apiDelete = api.delete;
export default api;
