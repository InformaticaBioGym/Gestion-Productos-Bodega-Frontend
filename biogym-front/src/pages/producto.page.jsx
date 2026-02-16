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
        {p.codigo_barra && (
          <div
            className="user-subdata"
            style={{ fontSize: "0.8rem", color: "#ffffff" }}
          >
            Código: {p.codigo_barra}
          </div>
        )}
        <div className="user-subdata">
          <span style={{ fontWeight: "bold" }}>SKU: {p.sku}</span>
        </div>
        {p.observaciones && (
          <div
            className="user-subdata"
            style={{ fontSize: "0.8rem", color: "#ffffff" }}
          >
            {p.observaciones}
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
            <label>Nombre del producto</label>
            <input
              name="nombre"
              value={formProd.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Mancuerna 10kg"
            />
            <label>Código de Barras</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                name="codigo_barra"
                value={formProd.codigo_barra}
                onChange={handleInputChange}
                placeholder="Escribe o escanea ➜"
                style={{ flex: 1, minWidth: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowFormScanner(true)}
                className="btn-view"
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ffd21f",
                  cursor: "pointer",
                  backgroundColor: "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "42px",
                  width: "45px",
                  flexShrink: 0,
                }}
                title="Escanear Código"
              >
                <img
                  src="/icono_codigo.png"
                  alt="Scan"
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                  }}
                />
              </button>
            </div>
            <label>SKU </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                name="sku"
                value={formProd.sku}
                onChange={handleInputChange}
                required
                placeholder="Ej: PRO-12 o usar codigo ➜"
                style={{ flex: 1, minWidth: 0 }}
              />
              {formProd.codigo_barra && (
                <button
                  type="button"
                  onClick={() =>
                    setFormProd({ ...formProd, sku: formProd.codigo_barra })
                  }
                  className="btn-view"
                  style={{
                    backgroundColor: "#444",
                    color: "#ffd21f",
                    border: "1px solid #ffd21f",
                    padding: "8px 10px",
                    whiteSpace: "nowrap",
                    height: "42px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    borderRadius: "6px",
                    fontWeight: "bold",
                  }}
                  title="Copiar código de barras aquí"
                >
                  Usar Código
                </button>
              )}
            </div>
            <label>Observaciones</label>
            <input
              name="observaciones"
              value={formProd.observaciones}
              onChange={handleInputChange}
              placeholder="ej: Esta en 2 cajas, frágil, etc."
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
                <strong>Código de Barras:</strong>{" "}
                {prodSeleccionado.codigo_barra || "---"}
              </p>
              <p>
                <strong>SKU:</strong> {prodSeleccionado.sku}
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
