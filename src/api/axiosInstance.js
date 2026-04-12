import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ REQUEST: attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE: auto refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ If unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // 🚀 request new access token
        const res = await axios.post(
          `${BASE_URL}/users/refresh-token/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = res.data.access;

        // ✅ save new token
        localStorage.setItem("accessToken", newAccessToken);

        // ✅ retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // 💣 refresh fail → logout পুরো system
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;