import axios from "axios";

let URL = import.meta.env.VITE_API_URL;
if (window.location.hostname !== "localhost") {
  URL = "/api";
}

const api = axios.create({
  baseURL: URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
