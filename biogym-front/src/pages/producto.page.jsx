import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import { useAuth } from "../context/auth.context";
import {
  obtenerProductosRequest,
  crearProductoRequest,
  editarProductoRequest,
  eliminarProductoRequest,
} from "../services/producto.service";
import "./producto.page.css";

function ProductosPage() {
  const { user } = useAuth();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [prodSeleccionado, setProdSeleccionado] = useState(null);

  const [formProd, setFormProd] = useState({
    sku: "",
    nombre: "",
  });

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

  const dibujarFilaProducto = (p) => (
    <div key={p.id} className="list-row">
      <div className="user-data">
        <span className="user-name">{p.nombre}</span>
        <div className="user-subdata">
          <span style={{ fontWeight: "bold" }}>SKU: {p.sku}</span>
        </div>
      </div>
      <button className="btn-view" onClick={() => abrirModalVer(p)}>
        Ver
      </button>
    </div>
  );

  const handleInputChange = (e) => {
    setFormProd({ ...formProd, [e.target.name]: e.target.value });
  };

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

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (modalTipo === "add") {
        await crearProductoRequest(formProd);
        alert("Producto creado");
      } else {
        await editarProductoRequest(prodSeleccionado.id, formProd);
        alert("Producto actualizado");
      }
      cargarProductos(busqueda);
      cerrarModal();
    } catch (error) {
      const msg = error.response?.data?.detalle || error.response?.data?.mensaje || "Error interno";
      alert("Error: " + msg);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await eliminarProductoRequest(prodSeleccionado.id);
      alert("Producto eliminado");
      cargarProductos();
      cerrarModal();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        {/* BUSCADOR */}
        <div className="search-bar-container">
          <span
            className="search-icon"
            onClick={() => cargarProductos(busqueda)}
            style={{ cursor: "pointer" }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por SKU o Nombre (Enter)..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && cargarProductos(busqueda)}
          />
        </div>

        <div className="section-title">
          <h2>Inventario</h2>
        </div>
        <Table
          title="Productos"
          data={productos}
          isLoading={cargando}
          onAdd={abrirModalAdd}
          renderRow={dibujarFilaProducto}
        />
      </div>
      <Modal isOpen={modalOpen} onClose={cerrarModal}>
        {/* TÍTULO */}
        <h3>
          {modalTipo === "add" && "Nuevo Producto"}
          {modalTipo === "view" && "Detalle Producto"}
          {modalTipo === "edit" && "Editar Producto"}
        </h3>
        {/* FORMULARIO ADD / EDIT */}
        {(modalTipo === "add" || modalTipo === "edit") && (
          <form className="modal-form" onSubmit={handleGuardar}>
            <label>SKU </label>
            <input
              name="sku"
              value={formProd.sku}
              onChange={handleInputChange}
              required
              placeholder="Ej: PROD-123"
            />

            <label>Nombre</label>
            <input
              name="nombre"
              value={formProd.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Mancuerna 10kg"
            />
            <div className="modal-actions">
              <button type="submit" className="btn-accept">
                Guardar
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {/* VER */}
        {modalTipo === "view" && prodSeleccionado && (
          <>
            <div className="user-detail-info">
              <p>
                <strong>SKU:</strong> {prodSeleccionado.sku}
              </p>
              <p>
                <strong>Nombre:</strong> {prodSeleccionado.nombre}
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn-edit" onClick={irAEditar}>
                Editar
              </button>
              {user.rol === "administrador" && (
                <button className="btn-delete" onClick={handleEliminar}>
                  Eliminar
                </button>
              )}
            </div>
          </>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

export default ProductosPage;
