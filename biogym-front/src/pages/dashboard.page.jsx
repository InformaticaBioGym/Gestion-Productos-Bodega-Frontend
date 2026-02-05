import Header from "../components/header";
import Footer from "../components/footer";
import { useDashboard } from "../hooks/dashboard.hook";
import "./dashboard.page.css";

function DashboardPage() {
  const { menuItems } = useDashboard();

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-card" onClick={item.action}>
              <span className="card-icon">{item.icon}</span>
              <span className="card-title">{item.title}</span>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;
