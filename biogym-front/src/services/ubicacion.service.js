import api from "./axios.config";

export const obtenerUbicacionesRequest = async () => {
  return await api.get("/ubicaciones");
};

export const crearUbicacionRequest = async (formData) => {
  return await api.post("/ubicaciones", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editarUbicacionRequest = async (id, formData) => {
  return await api.put(`/ubicaciones/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const eliminarUbicacionRequest = async (id) => {
  return await api.delete(`/ubicaciones/${id}`);
};
