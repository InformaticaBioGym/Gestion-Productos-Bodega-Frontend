import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
