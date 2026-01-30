import { useAuth } from "../context/auth.context.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: "#252525",
        padding: "0px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #333",
        height: "60px",
      }}
    >
      <div
        className="header-left"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <h1 style={{ margin: 0, fontSize: "1.2rem", color: "white" }}>
          BioGym
        </h1>
        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>Inventario</span>
      </div>
      <div
        className="user-info"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <span style={{ fontSize: "1.5rem" }}>👤</span>
        <button
          onClick={logout}
          style={{
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            margin: 0,
            marginTop: 0,
            height: "fit-content",
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}

export default Header;
