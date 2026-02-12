import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import SearchBar from "../components/search-bar";
import BarcodeScannerModal from "../components/barcode-scanner-modal";
import { useProductos } from "../hooks/producto.hook";

function ProductosPage() {
  const {
    productos,
    cargando,
    enviando,
    busqueda,
    setBusqueda,
    esAdmin,
    modalOpen,
    modalTipo,
    prodSeleccionado,
    formProd,
    setFormProd,
    cargarProductos,
    handleInputChange,
    handleGuardar,
    handleEliminar,
    abrirModalAdd,
    abrirModalVer,
    irAEditar,
    cerrarModal,
  } = useProductos();

  const [showFormScanner, setShowFormScanner] = useState(false);

  const dibujarFilaProducto = (p) => (
    <div key={p.id} className="list-row">
      <div className="user-data">
        <span className="user-name">{p.nombre}</span>
        <div className="user-subdata">
          <span style={{ fontWeight: "bold" }}>SKU: {p.sku}</span>
        </div>
        {p.codigo_barra && (
          <div
            className="user-subdata"
            style={{ fontSize: "0.8rem", color: "#666" }}
          >
            Code: {p.codigo_barra}
          </div>
        )}
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
        <SearchBar
          placeholder="Buscar por SKU, Nombre o Código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onSearch={cargarProductos}
          showScanner={true}
        />

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
            <label>Nombre</label>
            <input
              name="nombre"
              value={formProd.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Mancuerna 10kg"
            />
            <label>SKU </label>
            <input
              name="sku"
              value={formProd.sku}
              onChange={handleInputChange}
              required
              placeholder="Ej: PROD-123"
            />
            <label>Código de Barras</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                name="codigo_barra"
                value={formProd.codigo_barra}
                onChange={handleInputChange}
                placeholder="Escanea o escribe..."
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowFormScanner(true)}
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor: "#f0f0f0",
                }}
                title="Escanear Código"
              >
                📷
              </button>
            </div>
            <label>Observaciones</label>
            <input
              name="observaciones"
              value={formProd.observaciones}
              onChange={handleInputChange}
              placeholder="ej: esta en 2 cajas, frágil, etc."
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

        {/* Ver */}
        {modalTipo === "view" && prodSeleccionado && (
          <>
            <div className="user-detail-info">
              <p>
                <strong>Nombre:</strong> {prodSeleccionado.nombre}
              </p>
              <p>
                <strong>SKU:</strong> {prodSeleccionado.sku}
              </p>
              <p>
                <strong>Código de Barras:</strong>{" "}
                {prodSeleccionado.codigo_barra || "---"}
              </p>
              <p>
                <strong>Observaciones:</strong>
              </p>
              <p
                style={{
                  fontStyle: "italic",
                  color: "#555",
                  background: "#f9f9f9",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {prodSeleccionado.observaciones || "Sin observaciones"}
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn-edit" onClick={irAEditar}>
                Editar
              </button>
              {esAdmin && (
                <button
                  className="btn-delete"
                  onClick={handleEliminar}
                  disabled={enviando}
                  style={{ opacity: enviando ? 0.7 : 1 }}
                >
                  {enviando ? "Eliminando..." : "Eliminar"}
                </button>
              )}
            </div>
          </>
        )}
      </Modal>
      {showFormScanner && (
        <BarcodeScannerModal
          onClose={() => setShowFormScanner(false)}
          onScan={(code) => {
            setFormProd((prev) => ({ ...prev, codigo_barra: code }));
            setShowFormScanner(false);
          }}
        />
      )}
      <Footer />
    </div>
  );
}

export default ProductosPage;
