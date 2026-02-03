import api from "./axios.config";

export const obtenerBodegasRequest = async () => {
  return await api.get("/bodegas");
};

export const crearBodegaRequest = async (bodega) => {
  return await api.post("/bodegas", bodega);
};

export const editarBodegaRequest = async (id, bodega) => {
  return await api.put(`/bodegas/${id}`, bodega);
};

export const eliminarBodegaRequest = async (id) => {
  return await api.delete(`/bodegas/${id}`);
};
