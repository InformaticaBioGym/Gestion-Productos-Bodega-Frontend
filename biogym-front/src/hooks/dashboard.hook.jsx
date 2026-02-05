import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

export function useDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuAdmin = [
    {
      title: "Usuarios",
      icon: "👥",
      action: () => navigate("/usuarios"),
    },
    {
      title: "Productos",
      icon: "📦",
      action: () => navigate("/productos"),
    },
    {
      title: "Bodegas",
      icon: "🏭",
      action: () => navigate("/bodegas"),
    },
    {
      title: "Ubicaciones",
      icon: "📍",
      action: () => navigate("/ubicaciones"),
    },
  ];

  const menuTrabajador = [
    {
      title: "Editar productos",
      icon: "📦",
      action: () => navigate("/productos"),
    },
    {
      title: "Ubicación producto",
      icon: "📍",
      action: () => navigate("/ubicaciones"),
    },
    {
      title: "Bodegas",
      icon: "🏭",
      action: () => navigate("/bodegas"),
    },
    {
      title: "Mi Perfil",
      icon: "👤",
      tipo: "perfil",
    },
  ];

  const menuItems = user?.rol === "administrador" ? menuAdmin : menuTrabajador;

  return {
    menuItems,
    user,
  };
}
