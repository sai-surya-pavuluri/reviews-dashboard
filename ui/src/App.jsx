import { useState } from 'react'
import './App.css'
import ManagerDashboard from'./components/ManagerDashboard'
import PropertyPage from './components/PropertyPage'
import homeIcon from "./assets/home.png";

export default function App() {

  const [route, setRoute] = useState("dashboard")

  return (
    <div>
      <nav style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #eee"}}>
        <button onClick={()=>setRoute("dashboard")}>
          <img 
            src={homeIcon} 
            alt="Home" 
            style={{ width: "24px", height: "24px" }} 
          />
        </button>
        <button onClick={()=>setRoute("property")}>Properties</button>
      </nav>
      {route==="dashboard" ? <ManagerDashboard/> : <PropertyPage/>}
    </div>
  )
}
