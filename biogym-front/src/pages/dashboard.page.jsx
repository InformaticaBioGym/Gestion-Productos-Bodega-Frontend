import { useAuth } from "../context/auth.context.jsx";
import "./dashboard.page.css"; //

function DashboardPage() {
  const { logout, user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Control BioGym</h1>
      
      <h2 className="dashboard-subtitle">
        Hola, {user ? user.nombre : "Administrador"}
      </h2>
      
      <p className="dashboard-text">
        Selecciona una opción del menú para comenzar 
      </p>

      <button className="btn-logout" onClick={() => logout()}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default DashboardPage;