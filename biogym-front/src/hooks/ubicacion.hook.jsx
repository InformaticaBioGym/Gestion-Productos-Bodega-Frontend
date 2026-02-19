import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  obtenerUbicacionesRequest,
  crearUbicacionRequest,
  editarUbicacionRequest,
  eliminarUbicacionRequest,
} from "../services/ubicacion.service";
import { obtenerProductosRequest } from "../services/producto.service";
import { obtenerBodegasRequest } from "../services/bodega.service";

const API_URL = import.meta.env.VITE_API_URL;

export function useUbicaciones() {
  const [searchParams] = useSearchParams();
  const busquedaInicial = searchParams.get("busqueda") || "";

  const [ubicaciones, setUbicaciones] = useState([]);
  const [listaBodegas, setListaBodegas] = useState([]);

  const [productosSugeridos, setProductosSugeridos] = useState([]);
  const [buscandoProd, setBuscandoProd] = useState(false);
  const [prodSearchTerm, setProdSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProdName, setSelectedProdName] = useState(null);

  const isScanning = useRef(false);

  const [busqueda, setBusqueda] = useState(busquedaInicial);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // --- MODAL  ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [ubicacionSel, setUbicacionSel] = useState(null);

  // ---IMAGEN ---
  const [imgModalUrl, setImgModalUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- FORMULARIO ---
  const [form, setForm] = useState({
    producto_id: "",
    bodega_id: "",
    estante: "",
    descripcion: "",
    foto: null,
  });

  useEffect(() => {
    if (isScanning.current) return;

    if (prodSearchTerm.length < 2 || selectedProdName) {
      setProductosSugeridos([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setBuscandoProd(true);
      try {
        const res = await obtenerProductosRequest(prodSearchTerm);
        setProductosSugeridos(res.data);
        setShowSuggestions(true);
      } catch (error) {
        setProductosSugeridos([]);
        setShowSuggestions(true);
      } finally {
        setBuscandoProd(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [prodSearchTerm, selectedProdName]);

  const handleCodigoEscaneado = async (codigo) => {
    isScanning.current = true;
    setForm((prev) => ({ ...prev, producto_id: "" }));
    setSelectedProdName(null);
    setProdSearchTerm(codigo);
    setBuscandoProd(true);
    setShowSuggestions(true);
    try {
      const res = await obtenerProductosRequest(codigo);
      const productos = res.data;
      const matchExacto = productos.find(
        (p) =>
          p.codigo_barra &&
          p.codigo_barra.toLowerCase() === codigo.toLowerCase(),
      );

      if (matchExacto) {
        seleccionarProducto(matchExacto);
        toast.success(`Producto "${matchExacto.nombre}" seleccionado`);
        return;
      } else {
        toast.error("Producto no encontrado");
        setProductosSugeridos([]);
      }
    } catch (error) {
      toast.error("Producto no encontrado");
      setProductosSugeridos([]);
    } finally {
      setBuscandoProd(false);
      setTimeout(() => {
        isScanning.current = false;
      }, 200);
    }
  };

  // --- DATOS ---
  const cargarDatos = async (termino = "") => {
    try {
      setCargando(true);
      try {
        const resUbi = await obtenerUbicacionesRequest(termino);
        setUbicaciones(Array.isArray(resUbi.data) ? resUbi.data : []);
      } catch (e) {
        if (e.response?.status === 404) setUbicaciones([]);
      }
      if (listaBodegas.length === 0) {
        try {
          const resBod = await obtenerBodegasRequest();
          setListaBodegas(Array.isArray(resBod.data) ? resBod.data : []);
        } catch (e) {
          console.error("Error bodegas:", e);
        }
      }
    } catch (error) {
      console.error("Error general:", error);
      toast.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (busquedaInicial) {
      setBusqueda(busquedaInicial);
      cargarDatos(busquedaInicial);
    } else {
      cargarDatos("");
    }
  }, [busquedaInicial]);

  const obtenerUrlImagen = (img) => {
    if (!img) return "https://via.placeholder.com/50?text=Sin+Foto";
    return img.startsWith("http") ? img : `${API_URL}/${img}`;
  };

  const seleccionarProducto = (prod) => {
    setForm((prev) => ({ ...prev, producto_id: prod.id }));
    setSelectedProdName(`${prod.nombre} (SKU: ${prod.sku})`);
    setProdSearchTerm("");
    setShowSuggestions(false);
    setProductosSugeridos([]);
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
      const msg =
        error.response?.data?.detalle ||
        error.response?.data?.mensaje ||
        "Error interno";
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
          setEnviando(true);
          try {
            await eliminarUbicacionRequest(ubicacionSel.id);
            toast.success("Ubicación eliminada");
            cargarDatos(busqueda);
            setModalOpen(false);
          } catch (e) {
            toast.error("Error al eliminar la ubicación");
          } finally {
            setEnviando(false);
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
    setProductosSugeridos([]);
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
    setSelectedProdName(
      u.producto ? `${u.producto.nombre} (SKU: ${u.producto.sku})` : null,
    );
    setModalTipo("view");
    setModalOpen(true);
  };

  const irAEditar = () => setModalTipo("edit");
  const cerrarModal = () => setModalOpen(false);

  return {
    ubicaciones,
    listaBodegas,
    productosSugeridos,
    buscandoProd,
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
    cerrarModal,
    handleCodigoEscaneado,
  };
}
