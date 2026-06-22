import axios from "axios";

/**
 * Cliente Axios compartido para todos los servicios internos.
 * Gestiona la inyección del token de autenticación y el manejo global de errores HTTP.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_API + "/api/v1",
});

/** Endpoints que no deben disparar el redirect por 401 */
const AUTH_ENDPOINTS = ["sign-in", "sign-up", "password-recovery"];

/**
 * Endpoints donde 401 significa "sin permiso", no sesión expirada.
 * No deben limpiar la sesión ni redirigir al login.
 */
const PERMISSION_ONLY_ENDPOINTS = ["add-collaborator"];

const isAuthEndpoint = (url = "") =>
  AUTH_ENDPOINTS.some((path) => url.includes(path));

const isPermissionEndpoint = (url = "") =>
  PERMISSION_ONLY_ENDPOINTS.some((path) => url.includes(path));

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAuth");
};

// ── Request interceptor: inyecta Bearer token ─────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const rawToken = (localStorage.getItem("token") ?? "").trim();
  const token = rawToken.replace(/^Bearer\s+/i, "").trim();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: manejo global de errores HTTP ───────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status;
    const url = error.config?.url ?? "";

    if (status === 401 && !isAuthEndpoint(url) && !isPermissionEndpoint(url) && localStorage.getItem("token")) {
      // Sesión expirada — limpia y redirige al login
      clearSession();
      window.location.href = "/auth/email-login";
    }

    if (status && status >= 500) {
      console.error(`[API] Error ${status} en ${url}:`, error.response?.data);
    }

    return Promise.reject(error);
  }
);
