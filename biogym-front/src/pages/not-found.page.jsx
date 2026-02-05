import { Link } from "react-router-dom";
import "../styles/layout.css";

function NotFoundPage() {
  return (
    <div className="page-container" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <h2>¡Ups! Página no encontrada</h2>
      <p>Parece que te has perdido en el almacén.</p>
      <Link to="/dashboard" className="btn-accept" style={{ textDecoration: "none", marginTop: "20px", display: "inline-block", width: "auto" }}>
        Volver al Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;