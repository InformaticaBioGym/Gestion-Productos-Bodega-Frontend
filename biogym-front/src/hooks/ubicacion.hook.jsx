import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  obtenerUbicacionesRequest,
  crearUbicacionRequest,
  editarUbicacionRequest,
  eliminarUbicacionRequest,
} from "../services/ubicacion.service";
import { obtenerProductosRequest } from "../services/producto.service";
import { obtenerBodegasRequest } from "../services/bodega.service";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export function useUbicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [listaBodegas, setListaBodegas] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // --- MODAL  ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [ubicacionSel, setUbicacionSel] = useState(null);

  // ---IMAGEN ---
  const [imgModalUrl, setImgModalUrl] = useState(null);

  // --- FORMULARIO ---
  const [form, setForm] = useState({
    producto_id: "",
    bodega_id: "",
    estante: "",
    descripcion: "",
    foto: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const [prodSearchTerm, setProdSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProdName, setSelectedProdName] = useState(null);

  // --- DATOS ---
  const cargarDatos = async (termino = "") => {
    try {
      setCargando(true);
      try {
        const resUbi = await obtenerUbicacionesRequest(termino);
        setUbicaciones(Array.isArray(resUbi.data) ? resUbi.data : []);
      } catch (e) {
        if (e.response?.status === 404) setUbicaciones([]);
        else console.error("Error al cargar ubicaciones:", e);
      }
      
      if (listaProductos.length === 0) {
        try {
          const resProd = await obtenerProductosRequest();
          setListaProductos(Array.isArray(resProd.data) ? resProd.data : []);
        } catch (e) { console.error("Error productos:", e); }
      }
      
      if (listaBodegas.length === 0) {
        try {
          const resBod = await obtenerBodegasRequest();
          setListaBodegas(Array.isArray(resBod.data) ? resBod.data : []);
        } catch (e) { console.error("Error bodegas:", e); }
      }

    } catch (error) {
      console.error("Error general:", error);
      toast.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerUrlImagen = (img) => {
    if (!img) return "https://via.placeholder.com/50?text=Sin+Foto";
    return img.startsWith("http") ? img : `${API_URL}/${img}`;
  };

  const productosSugeridos = listaProductos
    .filter((p) => {
      const term = prodSearchTerm.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    })
    .slice(0, 10);

  const seleccionarProducto = (prod) => {
    setForm({ ...form, producto_id: prod.id });
    setSelectedProdName(`${prod.nombre} (SKU: ${prod.sku})`);
    setProdSearchTerm("");
    setShowSuggestions(false);
  };

  const quitarProducto = () => {
    setForm({ ...form, producto_id: "" });
    setSelectedProdName(null);
  };

  // --- FORMULARIO ---
  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- CRUD ---
  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.producto_id) {
      toast.warning("Debes seleccionar un producto de la lista");
      return;
    }
    if (enviando) return;

    try {
      setEnviando(true);
      const formData = new FormData();
      formData.append("producto_id", form.producto_id);
      formData.append("bodega_id", form.bodega_id);
      formData.append("descripcion", form.descripcion);
      if (form.estante) formData.append("estante", form.estante);
      if (form.foto instanceof File) formData.append("foto", form.foto);

      if (modalTipo === "add") {
        await crearUbicacionRequest(formData);
        toast.success("¡Ubicación registrada correctamente!");
      } else {
        await editarUbicacionRequest(ubicacionSel.id, formData);
        toast.success("Ubicación actualizada con éxito");
      }
      setModalOpen(false);
      cargarDatos(busqueda);
    } catch (error) {
      const msg = error.response?.data?.detalle || error.response?.data?.mensaje || "Error interno";
      toast.error("No se pudo guardar: " + msg);
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async () => {
    toast("¿Estás seguro de eliminar esta ubicación?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarUbicacionRequest(ubicacionSel.id);
            toast.success("Ubicación eliminada");
            cargarDatos(busqueda);
            setModalOpen(false);
          } catch (e) {
            toast.error("Error al eliminar la ubicación");
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  const abrirModalAdd = () => {
    setForm({
      producto_id: "",
      bodega_id: "",
      estante: "",
      descripcion: "",
      foto: null,
    });
    setPreviewUrl(null);
    setProdSearchTerm("");
    setSelectedProdName(null);
    setShowSuggestions(false);
    setModalTipo("add");
    setModalOpen(true);
  };

  const abrirModalVer = (u) => {
    setUbicacionSel(u);
    const url = obtenerUrlImagen(u.foto);
    setForm({
      ...u,
      producto_id: u.producto?.id,
      bodega_id: u.bodega?.id,
      foto: null,
    });
    setPreviewUrl(url);
    setSelectedProdName(u.producto ? `${u.producto.nombre} (SKU: ${u.producto.sku})` : null);
    setModalTipo("view");
    setModalOpen(true);
  };

  const irAEditar = () => setModalTipo("edit");
  const cerrarModal = () => setModalOpen(false);

  return {
    ubicaciones,
    listaBodegas,
    productosSugeridos,
    busqueda,
    cargando,
    enviando,
    modalOpen,
    modalTipo,
    ubicacionSel,
    imgModalUrl,
    form,
    previewUrl,
    prodSearchTerm,
    showSuggestions,
    selectedProdName,
    setBusqueda,
    setImgModalUrl,
    setProdSearchTerm,
    setShowSuggestions,
    cargarDatos,
    obtenerUrlImagen,
    seleccionarProducto,
    quitarProducto,
    handleInputChange,
    handleFileChange,
    handleGuardar,
    handleEliminar,
    abrirModalAdd,
    abrirModalVer,
    irAEditar,
    cerrarModal
  };
}