import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import SearchBar from "../components/search-bar";
import { useUbicaciones } from "../hooks/ubicacion.hook"; 
import "./ubicacion.page.css";

function UbicacionesPage() {
  const {
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
  } = useUbicaciones();

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

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        {/* BUSCADOR */}
        <SearchBar 
          placeholder="Buscar por SKU o Nombre..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)}
          onSearch={cargarDatos}
        />
        
        <div className="section-title">
          <h2>Mapa de Ubicaciones</h2>
        </div>

        <Table
          title="Ubicaciones"
          data={ubicaciones}
          isLoading={cargando}
          onAdd={abrirModalAdd}
          renderRow={dibujarFila}
        />
      </div>

      {/* === MODAL(añadir/editar/ver) === */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={
          modalTipo === "add"
            ? "Nueva Ubicación"
            : modalTipo === "edit"
              ? "Editar"
              : "Detalle Ubicación"
        }
      >
        {(modalTipo === "add" || modalTipo === "edit") && (
          <form className="modal-form" onSubmit={handleGuardar}>
            
            {/* --- AUTOCOMPLETADO DE PRODUCTOS --- */}
            <label>Producto</label>
            {selectedProdName ? (
              <div className="selected-product-badge">
                <span>{selectedProdName}</span>
                <span className="remove-product" onClick={quitarProducto}>✕</span>
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
                  style={{ border: !form.producto_id ? "1px solid #d32f2f" : "1px solid #ddd" }}
                />
                {showSuggestions && prodSearchTerm && (
                  <div className="suggestions-list">
                    {productosSugeridos.map((p) => (
                      <div key={p.id} className="suggestion-item" onClick={() => seleccionarProducto(p)}>
                        {p.nombre} <strong>(SKU: {p.sku})</strong>
                      </div>
                    ))}
                    {productosSugeridos.length === 0 && (
                      <div style={{ padding: 10, color: "#999" }}>No se encontraron productos.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            <label>Bodega</label>
            <select name="bodega_id" value={form.bodega_id} onChange={handleInputChange} required>
              <option value="">-- Selecciona Bodega --</option>
              {listaBodegas.map((b) => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>

            <label>N° Estante</label>
            <input
              type="number"
              name="estante"
              value={form.estante}
              onChange={handleInputChange}
              placeholder="Opcional"
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
              <button
                type="submit"
                className="btn-accept"
                disabled={enviando}
                style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? "not-allowed" : "pointer" }}
              >
                {enviando ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" className="btn-cancel" onClick={cerrarModal}>Cancelar</button>
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
              <p><strong>Producto:</strong> {ubicacionSel.producto?.nombre}</p>
              <p><strong>SKU:</strong> {ubicacionSel.producto?.sku}</p>
              <p>
                <strong>Ubicación:</strong> {ubicacionSel.bodega?.nombre}
                {ubicacionSel.estante && ` - Estante ${ubicacionSel.estante}`}
              </p>
              <p>
                <strong>Descripción:</strong>{" "}
                {ubicacionSel.descripcion || <span style={{ color: "#999", fontStyle: "italic" }}>No especificada</span>}
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-edit" onClick={irAEditar}>Editar</button>
              <button className="btn-delete" onClick={handleEliminar}>Eliminar</button>
            </div>
          </>
        )}
      </Modal>

      {/* === ZOOM IMAGEN === */}
      <Modal isOpen={!!imgModalUrl} onClose={() => setImgModalUrl(null)} title="Vista Previa">
        {imgModalUrl && (
          <img src={imgModalUrl} alt="Expandida" className="lightbox-image" />
        )}
      </Modal>

      <Footer />
    </div>
  );
}

export default UbicacionesPage;