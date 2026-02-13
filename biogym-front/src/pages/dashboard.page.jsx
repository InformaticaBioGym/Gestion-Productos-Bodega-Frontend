import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchBar from "../components/search-bar";
import { useDashboard } from "../hooks/dashboard.hook";
import "./dashboard.page.css";

function DashboardPage() {
  const { menuItems, user } = useDashboard();
  const [isFlipped, setIsFlipped] = useState(false);

  const [termino, setTermino] = useState("");
  const navigate = useNavigate();

  const handleSearchRedirect = (valor) => {
    if (!valor || valor.trim() === "") return;
    navigate(`/ubicaciones?busqueda=${encodeURIComponent(valor)}`);
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-hero">
        <h1 className="dashboard-title">Buscar producto</h1>        
        <div className="hero-search-container">
          <SearchBar
            placeholder="Escribe SKU, Nombre o escanea..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            onSearch={handleSearchRedirect}
            showScanner={true}
          />
        </div>
      </div>
      <main className="dashboard-content">
        <div className="menu-grid">
          {menuItems.map((item, index) => {
            if (item.tipo === "perfil") {
              return (
                <div
                  key={index}
                  className={`menu-card flip-container ${isFlipped ? "flipped" : ""}`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className="flip-inner">
                    {/* carta */}
                    <div className="flip-front">
                      <span className="card-icon">{item.icon}</span>
                      <span className="card-title">{item.title}</span>
                    </div>

                    {/* datos user*/}
                    <div className="flip-back">
                      <div className="profile-info">
                        <h3>{user?.nombre || "Usuario"}</h3>
                        <p>{user?.correo}</p>
                        <p
                          style={{
                            marginTop: "10px",
                            fontSize: "0.7rem",
                            color: "#ccc",
                          }}
                        >
                          {user?.rol?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className="menu-card" onClick={item.action}>
                <span className="card-icon">{item.icon}</span>
                <span className="card-title">{item.title}</span>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;
