import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import {
  obtenerUbicacionesRequest,
  crearUbicacionRequest,
  editarUbicacionRequest,
  eliminarUbicacionRequest,
} from "../services/ubicacion.service";
import { obtenerProductosRequest } from "../services/producto.service";
import { obtenerBodegasRequest } from "../services/bodega.service";
import "./ubicacion.page.css";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [listaBodegas, setListaBodegas] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [ubicacionSel, setUbicacionSel] = useState(null);

  // Formulario
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

  const [imgModalUrl, setImgModalUrl] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      try {
        const resUbi = await obtenerUbicacionesRequest();
        setUbicaciones(Array.isArray(resUbi.data) ? resUbi.data : []);
      } catch (e) {
        console.error("Error al cargar ubicaciones:", e);
      }
      try {
        const resProd = await obtenerProductosRequest();
        setListaProductos(Array.isArray(resProd.data) ? resProd.data : []);
      } catch (e) {
        console.error("Error al cargar productos:", e);
      }
      try {
        const resBod = await obtenerBodegasRequest();
        setListaBodegas(Array.isArray(resBod.data) ? resBod.data : []);
      } catch (e) {
        console.error("Error al cargar bodegas:", e);
      }
    } catch (error) {
      console.error("Error general:", error);
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    cargarDatos();
  }, []);

  // --- PROCESAR URL DE IMAGEN (CLOUDINARY) ---
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

  // --- DIBUJAR FILA ---
  const dibujarFila = (u) => {
    const fullImgUrl = obtenerUrlImagen(u.foto);
    return (
      <div key={u.id} className="list-row">
        <div className="ubi-data-row">
          <div className="text-info">
            <span className="user-name">
              {u.producto?.nombre || "Desconocido"}
            </span>
            <div className="user-subdata">
              <span style={{ fontWeight: "bold" }}>SKU: {u.producto?.sku}</span>
            </div>
            <div className="user-subdata">
              <span>{u.bodega?.nombre}</span>
              {u.estante && (
                <>
                  <span className="divider">|</span>
                  <span>Estante {u.estante}</span>
                </>
              )}
            </div>
          </div>
          <img
            src={fullImgUrl}
            alt="ubi"
            className="table-thumb"
            onClick={() => setImgModalUrl(fullImgUrl)}
            title="Clic para expandir"
          />
        </div>
        <button className="btn-view" onClick={() => abrirModalVer(u)}>
          Ver
        </button>
      </div>
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    setSelectedProdName(
      u.producto ? `${u.producto.nombre} (SKU: ${u.producto.sku})` : null,
    );

    setModalTipo("view");
    setModalOpen(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.producto_id) return alert("Debes seleccionar un producto");

    try {
      const formData = new FormData();
      formData.append("producto_id", form.producto_id);
      formData.append("bodega_id", form.bodega_id);
      formData.append("estante", form.estante);
      formData.append("descripcion", form.descripcion);
      if (form.foto instanceof File) formData.append("foto", form.foto);

      if (modalTipo === "add") {
        await crearUbicacionRequest(formData);
        alert("Guardado");
      } else {
        await editarUbicacionRequest(ubicacionSel.id, formData);
        alert("Actualizado");
      }
      cargarDatos();
      setModalOpen(false);
    } catch (error) {
      alert("Error: " + (error.response?.data?.mensaje || "Error interno"));
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar ubicación?")) return;
    try {
      await eliminarUbicacionRequest(ubicacionSel.id);
      cargarDatos();
      setModalOpen(false);
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  const ubicacionesFiltradas = ubicaciones.filter((u) => {
    const termino = busqueda.toLowerCase();
    const nombreProd = (u.producto?.nombre || "").toLowerCase();
    const skuProd = (u.producto?.sku || "").toLowerCase();
    return nombreProd.includes(termino) || skuProd.includes(termino);
  });

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Buscar en mapa (Producto/SKU)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="section-title">
          <h2>Mapa de Ubicaciones</h2>
        </div>

        <Table
          title="Ubicaciones"
          data={ubicacionesFiltradas}
          isLoading={cargando}
          onAdd={abrirModalAdd}
          renderRow={dibujarFila}
        />
      </div>

      {/* === MODAL === */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalTipo === "add"
            ? "Nueva Ubicación"
            : modalTipo === "edit"
              ? "Editar"
              : "Detalle"
        }
      >
        {(modalTipo === "add" || modalTipo === "edit") && (
          <form className="modal-form" onSubmit={handleGuardar}>
            {/* --- BUSCADOR DE PRODUCTOS --- */}
            <label>Producto</label>
            {selectedProdName ? (
              <div className="selected-product-badge">
                <span>{selectedProdName}</span>
                <span className="remove-product" onClick={quitarProducto}>
                  ✕
                </span>
              </div>
            ) : (
              <div className="autocomplete-container">
                <input
                  type="text"
                  placeholder="Escribe para buscar producto..."
                  value={prodSearchTerm}
                  onChange={(e) => {
                    setProdSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{
                    border: !form.producto_id
                      ? "1px solid #d32f2f"
                      : "1px solid #ddd",
                  }}
                />
                {showSuggestions && prodSearchTerm && (
                  <div className="suggestions-list">
                    {productosSugeridos.map((p) => (
                      <div
                        key={p.id}
                        className="suggestion-item"
                        onClick={() => seleccionarProducto(p)}
                      >
                        {p.nombre} <strong>(SKU: {p.sku})</strong>
                      </div>
                    ))}
                    {productosSugeridos.length === 0 && (
                      <div style={{ padding: 10, color: "#999" }}>
                        No se encontraron productos.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <label>Bodega</label>
            <select
              name="bodega_id"
              value={form.bodega_id}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Selecciona Bodega --</option>
              {listaBodegas.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>

            <label>N° Estante</label>
            <input
              type="number"
              name="estante"
              value={form.estante}
              onChange={handleInputChange}
              required
            />

            <label>Referencia/Descripción</label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleInputChange}
              placeholder="Ej: Frente al estante 3"
            />

            <label>Foto del lugar</label>
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="image-preview" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <div className="modal-actions">
              <button type="submit" className="btn-accept">
                Guardar
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* VER */}
        {modalTipo === "view" && ubicacionSel && (
          <>
            <img
              src={previewUrl}
              alt="Foto"
              className="detail-image"
              onClick={() => setImgModalUrl(previewUrl)}
            />
            <div className="user-detail-info">
              <p>
                <strong>Producto:</strong> {ubicacionSel.producto?.nombre}
              </p>
              <p>
                <strong>SKU:</strong> {ubicacionSel.producto?.sku}
              </p>{" "}
              {/* AGREGADO SKU */}
              <p>
                <strong>Ubicación:</strong> {ubicacionSel.bodega?.nombre} -
                Estante {ubicacionSel.estante}
              </p>
              <p>
                <strong>Detalle:</strong> {ubicacionSel.descripcion}
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-edit" onClick={() => setModalTipo("edit")}>
                Editar
              </button>
              <button className="btn-delete" onClick={handleEliminar}>
                Eliminar
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* === EXPANDIR IMAGEN === */}
      <Modal
        isOpen={!!imgModalUrl}
        onClose={() => setImgModalUrl(null)}
        title="Vista Previa"
      >
        {imgModalUrl && (
          <img src={imgModalUrl} alt="Expandida" className="lightbox-image" />
        )}
      </Modal>

      <Footer />
    </div>
  );
}
export default UbicacionesPage;
