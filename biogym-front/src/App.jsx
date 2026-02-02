import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth.context.jsx";
import LoginPage from "./pages/login.page.jsx";
import DashboardPage from "./pages/dashboard.page.jsx";
import UsuariosPage from "./pages/usuarios.page.jsx";
import ProductosPage from "./pages/producto.page.jsx";
import UbicacionesPage from "./pages/ubicacion.page.jsx";
import ProtectedRoute from "./components/protected.route.jsx";
import AdminRoute from "./components/admin.route.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/ubicaciones" element={<UbicacionesPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/usuarios" element={<UsuariosPage />} />
            </Route>
          </Route>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
