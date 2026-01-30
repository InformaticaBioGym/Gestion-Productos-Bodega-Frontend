import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  obtenerUsuariosRequest,
  crearUsuarioRequest,
  eliminarUsuarioRequest,
  editarUsuarioRequest,
} from "../services/user.service.js";
import "./usuarios.page.css";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "trabajador",
  });

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const res = await obtenerUsuariosRequest();
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      await crearUsuarioRequest(nuevoUsuario);
      alert("Usuario creado con éxito ✅");
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      console.error(error);
      alert(
        "Error al crear usuario: " +
          (error.response?.data?.mensaje || "Error interno"),
      );
    }
  };

  const handleEliminar = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar a este usuario?")
    ) {
      try {
        await eliminarUsuarioRequest(id);
        alert("Usuario eliminado 🗑️");
        cargarUsuarios();
        cerrarModal();
      } catch (error) {
        console.error(error);
        alert("No se pudo eliminar al usuario");
      }
    }
  };

  const irAEditar = () => {
    setNuevoUsuario({
      nombre: usuarioSeleccionado.nombre,
      correo: usuarioSeleccionado.correo,
      contraseña: "",
      rol: usuarioSeleccionado.rol,
    });
    setModalTipo("edit");
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    try {
      const datosActualizados = { ...nuevoUsuario };
      if (!datosActualizados.contraseña) {
        delete datosActualizados.contraseña;
      }
      await editarUsuarioRequest(usuarioSeleccionado.id, datosActualizados);
      alert("Usuario actualizado correctamente ✅");
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      console.error(error);
      alert(
        "Error al actualizar: " +
          (error.response?.data?.mensaje || "Error interno"),
      );
    }
  };

  const abrirModalAgregar = () => {
    setUsuarioSeleccionado(null);
    setNuevoUsuario({
      nombre: "",
      correo: "",
      contraseña: "",
      rol: "trabajador",
    });
    setModalTipo("add");
    setModalOpen(true);
  };

  const abrirModalVer = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalTipo("view");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = (u.nombre || "").toLowerCase();
    const correo = (u.correo || "").toLowerCase();
    const termino = busqueda.toLowerCase();
    return nombre.includes(termino) || correo.includes(termino);
  });

  return (
    <div className="page-container">
      <Header />
      <div className="content-scroll">
        {/* BUSCADOR */}
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="section-title">
          <h2>Gestión de Personal</h2>
        </div>
        {/* TABLA DE USUARIOS */}
        <div className="user-list-container">
          <div className="list-header">
            <span>Usuarios</span>
            <button className="btn-add" onClick={abrirModalAgregar}>
              Añadir +
            </button>
          </div>
          <div className="list-body">
            {cargando ? (
              <p style={{ textAlign: "center", padding: "20px" }}>
                Cargando...
              </p>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="list-row">
                  <div className="user-data">
                    <span className="user-name">{usuario.nombre}</span>
                    <div className="user-subdata">
                      <span className="user-correo">{usuario.correo}</span>
                      <span className="divider">|</span>
                      <span className="user-role-text">{usuario.rol}</span>
                    </div>
                  </div>
                  <button
                    className="btn-view"
                    onClick={() => abrirModalVer(usuario)}
                  >
                    Ver
                  </button>
                </div>
              ))
            )}

            {!cargando && usuariosFiltrados.length === 0 && (
              <p
                style={{ textAlign: "center", padding: "20px", color: "#999" }}
              >
                No se encontraron usuarios.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* === MODALES === */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-x" onClick={cerrarModal}>
              ×
            </button>
            {/* --- MODAL AÑADIR --- */}
            {modalTipo === "add" && (
              <>
                <h3>Nuevo Trabajador</h3>
                <form className="modal-form" onSubmit={handleCrearUsuario}>
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={nuevoUsuario.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Nombre Apellido"
                  />
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    required
                    value={nuevoUsuario.correo}
                    onChange={handleInputChange}
                    placeholder="Ej: correo@gmail.com"
                  />
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="contraseña"
                    required
                    value={nuevoUsuario.contraseña}
                    onChange={handleInputChange}
                    placeholder="*********"
                  />
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={nuevoUsuario.rol}
                    onChange={handleInputChange}
                  >
                    <option value="trabajador">Trabajador</option>
                    <option value="administrador">Administrador</option>
                  </select>
                  <button type="submit" className="btn-save">
                    Guardar Usuario
                  </button>
                </form>
              </>
            )}
            {/* --- MODAL VER --- */}
            {modalTipo === "view" && usuarioSeleccionado && (
              <>
                <h3>Detalle de Usuario</h3>
                <div className="user-detail-info">
                  <p>
                    <strong>ID:</strong> {usuarioSeleccionado.id}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {usuarioSeleccionado.nombre}
                  </p>
                  <p>
                    <strong>Correo:</strong> {usuarioSeleccionado.correo}
                  </p>
                  <p>
                    <strong>Rol:</strong> {usuarioSeleccionado.rol}
                  </p>
                </div>
                <div className="modal-actions">
                  <button className="btn-edit" onClick={irAEditar}>
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleEliminar(usuarioSeleccionado.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
            {/* --- MODAL EDITAR --- */}
            {modalTipo === "edit" && (
              <>
                <h3>Editar Usuario</h3>
                <form className="modal-form" onSubmit={handleEditarUsuario}>
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={nuevoUsuario.nombre}
                    onChange={handleInputChange}
                  />
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    required
                    value={nuevoUsuario.correo}
                    onChange={handleInputChange}
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
                  <select
                    name="rol"
                    value={nuevoUsuario.rol}
                    onChange={handleInputChange}
                  >
                    <option value="trabajador">Trabajador</option>
                    <option value="administrador">Administrador</option>
                  </select>
                  {/* BOTONES ACEPTAR / CANCELAR */}
                  <div className="modal-actions">
                    <button type="submit" className="btn-accept">
                      Aceptar
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
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default UsuariosPage;
