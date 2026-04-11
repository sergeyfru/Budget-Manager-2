import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true,
  headers:{
    'Cache-Control': 'no-cache'
  }
});

api.interceptors.request.use((config) => {
  console.log(config.baseURL);
  const token =
    useAuthStore.getState().access_token ||
    localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    console.log("Error 401: 'Unauthorized', Continue");

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      console.log("Attempting to refresh token...");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = res.data.access_token;
      useAuthStore.getState().setToken(newToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      console.log("Returning to original request after setting new token");
      return api(originalRequest);
    } catch (err) {
      console.error("Token refresh failed: ", err);
      processQueue(err, null);

      useAuthStore.getState().deleteToken();

      // Redirect to login page after token refresh failure
      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      console.log("Finished token refresh attempt");
      isRefreshing = false;
    }
  },
);
