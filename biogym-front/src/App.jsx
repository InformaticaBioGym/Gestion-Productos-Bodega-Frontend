import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth.context.jsx";
import LoginPage from "./pages/login.page.jsx";
import DashboardPage from "./pages/dashboard.page.jsx";
import ProtectedRoute from "./components/protected.route.jsx";

function App() {
  return (
    <AuthProvider>      
      <BrowserRouter>        
        <Routes>          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<DashboardPage />} />
             {/* aqui iran /productos, /usuarios, etc. */}
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;