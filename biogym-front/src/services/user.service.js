import api from "./axios.config";

export const crearUsuarioRequest = async (usuario) => {
  return await api.post("/auth/registrar", usuario); 
};

export const obtenerUsuariosRequest = async () => {
  return await api.get("/usuarios");
};

export const obtenerUsuarioPorIdRequest = async (id) => {
  return await api.get(`/usuarios/${id}`);
};

export const eliminarUsuarioRequest = async (id) => {
  return await api.delete(`/usuarios/${id}`);
};

export const editarUsuarioRequest = async (id, usuario) => {
    return await api.put(`/usuarios/${id}`, usuario);
};