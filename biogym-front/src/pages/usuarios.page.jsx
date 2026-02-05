import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/modal";
import Table from "../components/table";
import { useUsuarios } from "../hooks/usuarios.hook"; 
import "./usuarios.page.css";

function UsuariosPage() {
  const {
    usuariosFiltrados,
    cargando,
    busqueda,
    setBusqueda,
    modalOpen,
    modalTipo,
    usuarioSeleccionado,
    nuevoUsuario,
    handleInputChange,
    handleNombreChange,
    handleCrearUsuario,
    handleEditarUsuario,
    handleEliminar,
    abrirModalAgregar,
    abrirModalVer,
    irAEditar,
    cerrarModal
  } = useUsuarios();

  // Funcion tabla
  const dibujarFilaUsuario = (usuario) => (
    <div key={usuario.id} className="list-row">
      <div className="user-data">
        <span className="user-name">{usuario.nombre}</span>
        <div className="user-subdata">
          <span>{usuario.correo}</span>
          <span className="divider">|</span>
          <span>{usuario.rol}</span>
        </div>
      </div>
      <button className="btn-view" onClick={() => abrirModalVer(usuario)}>
        Ver
      </button>
    </div>
  );

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="section-title">
          <h2>Gestión de Personal</h2>
        </div>
        
        <Table
          title="Usuarios"
          data={usuariosFiltrados}
          isLoading={cargando}
          onAdd={abrirModalAgregar}
          renderRow={dibujarFilaUsuario}
        />
      </div>

      <Modal isOpen={modalOpen} onClose={cerrarModal}>
        <h3>
          {modalTipo === "add" && "Nuevo Trabajador"}
          {modalTipo === "edit" && "Editar Usuario"}
          {modalTipo === "view" && "Detalle de Usuario"}
        </h3>

        {/* AGREGAR */}
        {modalTipo === "add" && (
          <form className="modal-form" onSubmit={handleCrearUsuario}>
            <label>Nombre Completo</label>
            <input
              name="nombre"
              value={nuevoUsuario.nombre}
              onChange={handleNombreChange}
              required
              placeholder="Ej: Nombre Apellido"
            />
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={nuevoUsuario.correo}
              onChange={handleInputChange}
              required
              placeholder="Ej: correo@gmail.com"
            />
            <label>Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={nuevoUsuario.contraseña}
              onChange={handleInputChange}
              required
              placeholder="*********"
            />
            <label>Rol</label>
            <select name="rol" value={nuevoUsuario.rol} onChange={handleInputChange}>
              <option value="trabajador">Trabajador</option>
              <option value="administrador">Administrador</option>
            </select>
            <div className="modal-actions">
              <button type="submit" className="btn-accept">Guardar Usuario</button>
              <button type="button" className="btn-cancel" onClick={cerrarModal}>Cancelar</button>
            </div>
          </form>
        )}

        {/* EDITAR */}
        {modalTipo === "edit" && (
          <form className="modal-form" onSubmit={handleEditarUsuario}>
            <label>Nombre Completo</label>
            <input
              name="nombre"
              value={nuevoUsuario.nombre}
              onChange={handleNombreChange}
              required
            />
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={nuevoUsuario.correo}
              onChange={handleInputChange}
              required
            />
            <label>Contraseña (Opcional)</label>
            <input
              type="password"
              name="contraseña"
              value={nuevoUsuario.contraseña}
              onChange={handleInputChange}
              placeholder="Dejar vacía para no cambiar"
            />
            <label>Rol</label>
            <select name="rol" value={nuevoUsuario.rol} onChange={handleInputChange}>
              <option value="trabajador">Trabajador</option>
              <option value="administrador">Administrador</option>
            </select>
            <div className="modal-actions">
              <button type="submit" className="btn-accept">Aceptar</button>
              <button type="button" className="btn-cancel" onClick={cerrarModal}>Cancelar</button>
            </div>
          </form>
        )}

        {/* Ver */}
        {modalTipo === "view" && usuarioSeleccionado && (
          <>
            <div className="user-detail-info">
              <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</p>
              <p><strong>Correo:</strong> {usuarioSeleccionado.correo}</p>
              <p><strong>Rol:</strong> {usuarioSeleccionado.rol}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-edit" onClick={irAEditar}>Editar</button>
              <button className="btn-delete" onClick={handleEliminar}>Eliminar</button>
            </div>
          </>
        )}
      </Modal>
      <Footer />
    </div>
  );
}

export default UsuariosPage;