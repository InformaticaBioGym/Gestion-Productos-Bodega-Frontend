import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import SearchBar from "../components/search-bar";
import { useBodegas } from "../hooks/bodega.hook";

function BodegasPage() {
  const {
    bodegasFiltradas,
    cargando,
    enviando,
    busqueda,
    setBusqueda,
    esAdmin,
    modalOpen,
    modalTipo,
    bodegaSel,
    form,
    handleInputChange,
    handleGuardar,
    handleEliminar,
    abrirModalAdd,
    abrirModalVer,
    cerrarModal,
    irAEditar,
  } = useBodegas();

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

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        <SearchBar
          placeholder="Buscar bodega..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

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
        onClose={cerrarModal}
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
              placeholder="1, 2, 3..."
            />
            <div className="modal-actions">
              <button
                type="submit"
                className="btn-accept"
                disabled={enviando}
                style={{ opacity: enviando ? 0.7 : 1 }}
              >
                {enviando ? "Guardando..." : "Guardar"}
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
              {esAdmin && (
                <>
                  <button className="btn-edit" onClick={irAEditar}>
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={handleEliminar}
                    disabled={enviando}
                    style={{ opacity: enviando ? 0.7 : 1 }}
                  >
                    {enviando ? "Eliminando..." : "Eliminar"}
                  </button>
                </>
              )}
              {!esAdmin && (
                <button className="btn-cancel" onClick={cerrarModal}>
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
