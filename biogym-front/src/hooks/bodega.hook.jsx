import { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";
import {
  obtenerBodegasRequest,
  crearBodegaRequest,
  editarBodegaRequest,
  eliminarBodegaRequest,
} from "../services/bodega.service";

export function useBodegas() {
  const { user } = useAuth();
  const esAdmin = user?.rol === "administrador";

  const [bodegas, setBodegas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [bodegaSel, setBodegaSel] = useState(null);

  // Formulario
  const [form, setForm] = useState({
    nombre: "",
    ubicacion_fisica: "",
    n_estantes: "",
  });

  // --- DATOS ---
  const cargarBodegas = async () => {
    try {
      setCargando(true);
      const res = await obtenerBodegasRequest();
      setBodegas(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las bodegas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarBodegas();
  }, []);

  // --- formulario ---
  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (modalTipo === "add") {
        await crearBodegaRequest(form);
        toast.success("Bodega creada con éxito");
      } else {
        await editarBodegaRequest(bodegaSel.id, form);
        toast.success("Bodega actualizada con éxito");
      }
      cargarBodegas();
      setModalOpen(false);
    } catch (error) {
      const msg = error.response?.data?.detalle || error.response?.data?.mensaje || "Error interno";
      toast.error("Error: " + msg);
    }
  };

  const handleEliminar = async () => {
    toast("¿Estás seguro de eliminar esta bodega?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarBodegaRequest(bodegaSel.id);
            toast.success("Bodega eliminada");
            cargarBodegas();
            setModalOpen(false);
          } catch (error) {
            toast.error("No se pudo eliminar (¿Tiene productos asignados?)");
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  // --- MODAL ---
  const abrirModalAdd = () => {
    setForm({ nombre: "", ubicacion_fisica: "", n_estantes: "" });
    setModalTipo("add");
    setModalOpen(true);
  };

  const abrirModalVer = (bodega) => {
    setBodegaSel(bodega);
    setForm(bodega);
    setModalTipo("view");
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);
  
  const irAEditar = () => setModalTipo("edit");

  const bodegasFiltradas = bodegas.filter((b) => {
    const termino = busqueda.toLowerCase();
    return (
      b.nombre.toLowerCase().includes(termino) ||
      b.ubicacion_fisica.toLowerCase().includes(termino)
    );
  });

  return {
    bodegasFiltradas,
    cargando,
    busqueda,
    esAdmin,
    modalOpen,
    modalTipo,
    bodegaSel,
    form,
    setBusqueda,
    handleInputChange,
    handleGuardar,
    handleEliminar,
    abrirModalAdd,
    abrirModalVer,
    cerrarModal,
    irAEditar
  };
}