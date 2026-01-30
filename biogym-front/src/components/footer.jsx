import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const iconStyle = (path) => ({
    fontSize: "2rem",
    cursor: "pointer",
    color: location.pathname === path ? "#4CAF50" : "#777",
    transition: "color 0.3s",
  });

  return (
    <footer
      style={{
        backgroundColor: "#252525",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "1px solid #333",
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 100,
      }}
    >
      <span
        style={iconStyle("/dashboard")}
        onClick={() => navigate("/dashboard")}
        title="Ir al Inicio"
      >
        🏠
      </span>
    </footer>
  );
}

export default Footer;
