import api from "./axios.config";

export const obtenerProductosRequest = async (busqueda) => {
  const url = busqueda ? `/productos?busqueda=${busqueda}` : "/productos";
  return await api.get(url);
};

export const crearProductoRequest = async (producto) => {
  return await api.post("/productos", producto);
};

export const editarProductoRequest = async (id, producto) => {
  return await api.put(`/productos/${id}`, producto);
};

export const eliminarProductoRequest = async (id) => {
  return await api.delete(`/productos/${id}`);
};
