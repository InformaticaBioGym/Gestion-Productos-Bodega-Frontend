import { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";
import {
  obtenerProductosRequest,
  crearProductoRequest,
  editarProductoRequest,
  eliminarProductoRequest,
} from "../services/producto.service";

export function useProductos() {
  const { user } = useAuth();
  const esAdmin = user?.rol === "administrador";

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [prodSeleccionado, setProdSeleccionado] = useState(null);

  // Formulario
  const [formProd, setFormProd] = useState({
    sku: "",
    nombre: "",
  });

  // ---DATOS---
  const cargarProductos = async (termino = "") => {
    try {
      setCargando(true);
      const res = await obtenerProductosRequest(termino);
      setProductos(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // --- formulario ---
  const handleInputChange = (e) => {
    setFormProd({ ...formProd, [e.target.name]: e.target.value });
  };
  //---crud---
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (modalTipo === "add") {
        await crearProductoRequest(formProd);
        toast.success("Producto creado correctamente");
      } else {
        await editarProductoRequest(prodSeleccionado.id, formProd);
        toast.success("Producto actualizado correctamente");
      }
      cargarProductos(busqueda);
      cerrarModal();
    } catch (error) {
      const msg =
        error.response?.data?.detalle ||
        error.response?.data?.mensaje ||
        "Error interno";
      toast.error("Error: " + msg);
    }
  };

  const handleEliminar = async () => {
    toast("¿Seguro que deseas eliminar este producto?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarProductoRequest(prodSeleccionado.id);
            toast.success("Producto eliminado");
            cargarProductos(busqueda);
            cerrarModal();
          } catch (error) {
            toast.error("Error al eliminar el producto");
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  // --- MODAL ---
  const abrirModalAdd = () => {
    setFormProd({ sku: "", nombre: "" });
    setModalTipo("add");
    setModalOpen(true);
  };

  const abrirModalVer = (prod) => {
    setProdSeleccionado(prod);
    setFormProd({ sku: prod.sku, nombre: prod.nombre });
    setModalTipo("view");
    setModalOpen(true);
  };

  const irAEditar = () => {
    setModalTipo("edit");
  };

  const cerrarModal = () => setModalOpen(false);

  return {
    productos,
    cargando,
    busqueda,
    esAdmin,
    modalOpen,
    modalTipo,
    prodSeleccionado,
    formProd,
    setBusqueda,
    cargarProductos,
    handleInputChange,
    handleGuardar,
    handleEliminar,
    abrirModalAdd,
    abrirModalVer,
    irAEditar,
    cerrarModal,
  };
}
