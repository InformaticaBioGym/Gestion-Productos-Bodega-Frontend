import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

export function useDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const renderIcon = (src, alt) => (
    <img src={src} alt={alt} className="dashboard-icon-img" />
  );

  const menuAdmin = [
    {
      title: "Usuarios",
      icon: renderIcon("/icono_usuario.png", "Usuarios"),
      action: () => navigate("/usuarios"),
    },
    {
      title: "Productos",
      icon: renderIcon("/icono_producto.png", "Productos"),
      action: () => navigate("/productos"),
    },
    {
      title: "Bodegas",
      icon: renderIcon("/icono_bodega.png", "Bodegas"),
      action: () => navigate("/bodegas"),
    },
    {
      title: "Ubicaciones",
      icon: renderIcon("/icono_ubicacion.png", "Ubicaciones"),
      action: () => navigate("/ubicaciones"),
    },
  ];

  const menuTrabajador = [
    {
      title: "Editar productos",
      icon: renderIcon("/icono_producto.png", "Productos"),
      action: () => navigate("/productos"),
    },
    {
      title: "Ubicación producto",
      icon: renderIcon("/icono_ubicacion.png", "Ubicaciones"),
      action: () => navigate("/ubicaciones"),
    },
    {
      title: "Bodegas",
      icon: renderIcon("/icono_bodega.png", "Bodegas"),
      action: () => navigate("/bodegas"),
    },
    {
      title: "Mi Perfil",
      icon: renderIcon("/icono_usuario.png", "Perfil"),
      tipo: "perfil",
    },
  ];

  const menuItems = user?.rol === "administrador" ? menuAdmin : menuTrabajador;

  return {
    menuItems,
    user,
  };
}
