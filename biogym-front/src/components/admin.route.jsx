import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <h1>Cargando permisos...</h1>;
  if (!user || user.rol !== "administrador") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
