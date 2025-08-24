import { useState } from 'react'
import './App.css'
import ManagerDashboard from'./components/ManagerDashboard'
import PropertyPage from './components/PropertyPage'
import homeIcon from "./assets/home.png";

export default function App() {
  const [route, setRoute] = useState("dashboard");

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
      <h1 style={{ marginTop: "32px", marginBottom: "12px" }}>Manager Dashboard</h1>

      <nav
        style={{
          display: "flex",
          gap: 12,
          paddingBottom: 12,
          borderBottom: "1px solid #eee",
          marginBottom: "32px",
        }}
      >
        <button onClick={() => setRoute("dashboard")}>
          <img
            src={homeIcon}
            alt="Home"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
        <button onClick={() => setRoute("property")}>Properties</button>
      </nav>

      {route === "dashboard" ? <ManagerDashboard /> : <PropertyPage />}
    </div>
  );
}
