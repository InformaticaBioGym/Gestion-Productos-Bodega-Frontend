import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  obtenerUsuariosRequest,
  crearUsuarioRequest,
  eliminarUsuarioRequest,
  editarUsuarioRequest,
} from "../services/user.service.js";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Formulario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "trabajador",
  });

  // ---DATOS ---
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const res = await obtenerUsuariosRequest();
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      toast.error("Error al cargar la lista de usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // --- FORMULARIO ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    if (/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/.test(valor)) {
      setNuevoUsuario({ ...nuevoUsuario, nombre: valor });
    }
  };

  // --- CRUD  ---
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      await crearUsuarioRequest(nuevoUsuario);
      toast.success("Usuario creado con éxito");
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      const errorMsg =
        error.response?.data?.detalle ||
        error.response?.data?.mensaje ||
        "Error interno";
      toast.error("Error al crear usuario: " + errorMsg);
    }
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    try {
      const datosActualizados = { ...nuevoUsuario };
      if (!datosActualizados.contraseña) {
        delete datosActualizados.contraseña;
      }
      await editarUsuarioRequest(usuarioSeleccionado.id, datosActualizados);
      toast.success("Usuario actualizado correctamente");
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      const errorMsg =
        error.response?.data?.detalle ||
        error.response?.data?.mensaje ||
        "Error interno";
      toast.error("Error al actualizar: " + errorMsg);
    }
  };

  const handleEliminar = async () => {
    toast("¿Estás seguro de que quieres eliminar a este usuario?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarUsuarioRequest(usuarioSeleccionado.id);
            toast.success("Usuario eliminado");
            cargarUsuarios();
            cerrarModal();
          } catch (error) {
            toast.error("No se pudo eliminar al usuario");
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  // --- CONTROL DEL MODAL ---
  const abrirModalAgregar = () => {
    setUsuarioSeleccionado(null);
    setNuevoUsuario({
      nombre: "",
      correo: "",
      contraseña: "",
      rol: "trabajador",
    });
    setModalTipo("add");
    setModalOpen(true);
  };

  const abrirModalVer = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalTipo("view");
    setModalOpen(true);
  };

  const irAEditar = () => {
    setNuevoUsuario({
      nombre: usuarioSeleccionado.nombre,
      correo: usuarioSeleccionado.correo,
      contraseña: "",
      rol: usuarioSeleccionado.rol,
    });
    setModalTipo("edit");
  };

  const cerrarModal = () => setModalOpen(false);

  // --- FILTRO DE BÚSQUEDA ---
  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = (u.nombre || "").toLowerCase();
    const correo = (u.correo || "").toLowerCase();
    const termino = busqueda.toLowerCase();
    return nombre.includes(termino) || correo.includes(termino);
  });

  return {
    usuariosFiltrados,
    cargando,
    busqueda,
    modalOpen,
    modalTipo,
    usuarioSeleccionado,
    nuevoUsuario,
    setBusqueda,
    handleInputChange,
    handleNombreChange,
    handleCrearUsuario,
    handleEditarUsuario,
    handleEliminar,
    abrirModalAgregar,
    abrirModalVer,
    irAEditar,
    cerrarModal,
  };
}
