import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import { useProductos } from "../hooks/producto.hook";
import "./producto.page.css";

function ProductosPage() {
  const {
    productos,
    cargando,
    busqueda,
    setBusqueda,
    esAdmin,
    modalOpen,
    modalTipo,
    prodSeleccionado,
    formProd,
    cargarProductos,
    handleInputChange,
    handleGuardar,
    handleEliminar,
    abrirModalAdd,
    abrirModalVer,
    irAEditar,
    cerrarModal
  } = useProductos();

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
        <h3>
          {modalTipo === "add" && "Nuevo Producto"}
          {modalTipo === "view" && "Detalle Producto"}
          {modalTipo === "edit" && "Editar Producto"}
        </h3>

        {/* FORMULARIO añadir / editar */}
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
              <button type="submit" className="btn-accept">Guardar</button>
              <button type="button" className="btn-cancel" onClick={cerrarModal}>Cancelar</button>
            </div>
          </form>
        )}

        {/* Ver */}
        {modalTipo === "view" && prodSeleccionado && (
          <>
            <div className="user-detail-info">
              <p><strong>SKU:</strong> {prodSeleccionado.sku}</p>
              <p><strong>Nombre:</strong> {prodSeleccionado.nombre}</p>
            </div>

            <div className="modal-actions">
              <button className="btn-edit" onClick={irAEditar}>Editar</button>
              {esAdmin && (
                <button className="btn-delete" onClick={handleEliminar}>Eliminar</button>
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