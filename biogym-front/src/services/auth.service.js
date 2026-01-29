import api from "./axios.config";

export const loginRequest = async (credenciales) => {
  return await api.post("/auth/login", credenciales);
};
