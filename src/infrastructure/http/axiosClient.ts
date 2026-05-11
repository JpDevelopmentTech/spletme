import axios from "axios";

/**
 * Cliente Axios compartido con interceptor de autenticación.
 * Todos los servicios de infraestructura deben usar esta instancia.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_API + "/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const rawToken = (localStorage.getItem("token") ?? "").trim();
  const token = rawToken.replace(/^Bearer\s+/i, "").trim();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
