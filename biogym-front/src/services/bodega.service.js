import api from "./axios.config";

export const obtenerBodegasRequest = async () => {
  return await api.get("/bodegas");
};
