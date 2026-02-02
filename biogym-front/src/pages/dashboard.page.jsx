import { useAuth } from "../context/auth.context.jsx";
import { useNavigate } from "react-router-dom";
import "./dashboard.page.css";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // ADMINISTRADOR
  const menuAdmin = [
    { title: "Usuarios", icon: "👥", action: () => navigate("/usuarios") },
    {
      title: "Productos",
      icon: "📦",
      action: () => navigate("/productos"),
    },
    { title: "Bodegas",
      icon: "🏭",
      action: () => console.log("Ir a bodegas") },
    {
      title: "Ubicaciones",
      icon: "📍",
      action: () => navigate("/ubicaciones"),
    },
  ];

  // TRABAJADOR
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
      action: () => console.log("Ir a tareas"),
    },
    {
      title: "Mi Perfil",
      icon: "👤",
      action: () => console.log("Ir a perfil"),
    },
  ];
  const menuActual = user?.rol === "administrador" ? menuAdmin : menuTrabajador;

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <Header />
      {/* GRID */}
      <main className="dashboard-content">
        <div className="menu-grid">
          {menuActual.map((item, index) => (
            <div key={index} className="menu-card" onClick={item.action}>
              <span className="card-icon">{item.icon}</span>
              <span className="card-title">{item.title}</span>
            </div>
          ))}
        </div>
      </main>
      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default DashboardPage;
