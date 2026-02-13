import { useAuth } from "../context/auth.context.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Header() {
  const { logout } = useAuth();
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
        style={{ 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center", 
          gap: "12px"
        }}
      >
        <img 
          src="BioGym-logo.png" 
          alt="BioGym Logo" 
          style={{ 
            height: "38px",
            objectFit: "contain" 
          }} 
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.2rem", color: "white", lineHeight: "1.1" }}>
            BioGym
          </h1>
          <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Inventario</span>
        </div>
      </div>
      <div
        className="user-info"
        style={{ display: "flex", alignItems: "center" }}
      >
        <button
          onClick={logout}
          style={{
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}

export default Header;