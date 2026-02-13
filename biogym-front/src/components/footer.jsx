import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      path: "/usuarios",
      icon: "/icono_usuario.png",
      label: "Usuarios",
      action: () =>
        user?.rol === "administrador"
          ? navigate("/usuarios")
          : navigate("/dashboard"),
    },
    {
      path: "/bodegas",
      icon: "/icono_bodega.png",
      label: "Bodegas",
      action: () => navigate("/bodegas"),
    },
    {
      path: "/dashboard",
      icon: "/icono_casa.png",
      label: "Inicio",
      isCenter: true,
      action: () => navigate("/dashboard"),
    },
    {
      path: "/ubicaciones",
      icon: "/icono_ubicacion.png",
      label: "Ubicaciones",
      action: () => navigate("/ubicaciones"),
    },
    {
      path: "/productos",
      icon: "/icono_producto.png",
      label: "Productos",
      action: () => navigate("/productos"),
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#252525",
        height: "70px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #333",
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 -4px 10px rgba(0,0,0,0.3)",
        padding: "0 10px",
      }}
    >
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;

        const isActiveHome =
          item.path === "/dashboard" && location.pathname === "/";

        const activeState = isActive || isActiveHome;

        return (
          <div
            key={index}
            onClick={item.action}
            title={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: activeState
                ? "rgba(254, 241, 49, 0.15)"
                : "transparent",
              borderRadius: "12px",
              padding: "8px",
              width: "60px",
              height: "60px",
              transition: "all 0.3s ease",
              border: activeState
                ? "1px solid rgba(254, 241, 49, 0.3)"
                : "1px solid transparent",
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              style={{
                width: item.isCenter ? "32px" : "28px",
                height: item.isCenter ? "32px" : "28px",
                objectFit: "contain",
                opacity: activeState ? 1 : 0.6,
                filter: activeState
                  ? "drop-shadow(0 0 5px rgba(254, 241, 49, 0.5))"
                  : "grayscale(100%) brightness(1.5)",
                transition: "all 0.3s ease",
              }}
            />
          </div>
        );
      })}
    </footer>
  );
}

export default Footer;
