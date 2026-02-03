import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import { useAuth } from "../context/auth.context";
import {
  obtenerBodegasRequest,
  crearBodegaRequest,
  editarBodegaRequest,
  eliminarBodegaRequest,
} from "../services/bodega.service";
import "./bodega.page.css";

function BodegasPage() {
  const { user } = useAuth();
  const esAdmin = user.rol === "administrador";

  const [bodegas, setBodegas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [bodegaSel, setBodegaSel] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    ubicacion_fisica: "",
    n_estantes: "",
  });

  const cargarBodegas = async () => {
    try {
      setCargando(true);
      const res = await obtenerBodegasRequest();
      setBodegas(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarBodegas();
  }, []);

  const bodegasFiltradas = bodegas.filter((b) => {
    const termino = busqueda.toLowerCase();
    return (
      b.nombre.toLowerCase().includes(termino) ||
      b.ubicacion_fisica.toLowerCase().includes(termino)
    );
  });

  const dibujarFila = (b) => (
    <div key={b.id} className="list-row">
      <div className="user-data">
        <span className="user-name">{b.nombre}</span>
        <div className="user-subdata">
          <span>{b.ubicacion_fisica}</span>
          <span className="divider">|</span>
          <span style={{ fontWeight: "bold" }}>{b.n_estantes} estantes</span>
        </div>
      </div>
      <button className="btn-view" onClick={() => abrirModalVer(b)}>
        Ver
      </button>
    </div>
  );

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (modalTipo === "add") {
        await crearBodegaRequest(form);
        alert("Bodega creada");
      } else {
        await editarBodegaRequest(bodegaSel.id, form);
        alert("Bodega actualizada");
      }
      cargarBodegas();
      setModalOpen(false);
    } catch (error) {
      alert("Error: " + (error.response?.data?.mensaje || "Error interno"));
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar esta bodega?")) return;
    try {
      await eliminarBodegaRequest(bodegaSel.id);
      alert("Bodega eliminada");
      cargarBodegas();
      setModalOpen(false);
    } catch (error) {
      alert("Error al eliminar (¿Tiene productos asignados?)");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar bodega..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="section-title">
          <h2>Gestión de Bodegas</h2>
        </div>

        <Table
          title="Bodegas"
          data={bodegasFiltradas}
          isLoading={cargando}
          onAdd={esAdmin ? abrirModalAdd : null}
          renderRow={dibujarFila}
        />
      </div>

      {/* === MODAL === */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalTipo === "add"
            ? "Nueva Bodega"
            : modalTipo === "edit"
              ? "Editar Bodega"
              : "Detalle Bodega"
        }
      >
        {(modalTipo === "add" || modalTipo === "edit") && (
          <form className="modal-form" onSubmit={handleGuardar}>
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Bodega Central"
            />

            <label>Ubicación Física</label>
            <input
              name="ubicacion_fisica"
              value={form.ubicacion_fisica}
              onChange={handleInputChange}
              required
              placeholder="Ej: Av. Principal 123"
            />

            <label>Cantidad de Estantes</label>
            <input
              type="number"
              name="n_estantes"
              value={form.n_estantes}
              onChange={handleInputChange}
              required
            />

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

        {modalTipo === "view" && bodegaSel && (
          <>
            <div className="user-detail-info">
              <p>
                <strong>Nombre:</strong> {bodegaSel.nombre}
              </p>
              <p>
                <strong>Dirección:</strong> {bodegaSel.ubicacion_fisica}
              </p>
              <p>
                <strong>Capacidad:</strong> {bodegaSel.n_estantes} estantes
              </p>
            </div>

            <div className="modal-actions">
              {/* botones admin */}
              {esAdmin && (
                <>
                  <button
                    className="btn-edit"
                    onClick={() => setModalTipo("edit")}
                  >
                    Editar
                  </button>
                  <button className="btn-delete" onClick={handleEliminar}>
                    Eliminar
                  </button>
                </>
              )}
              {!esAdmin && (
                <button
                  className="btn-cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Cerrar
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

export default BodegasPage;
