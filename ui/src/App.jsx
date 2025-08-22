import { useState } from 'react'
import './App.css'
import ManagerDashboard from'./components/ManagerDashboard'
import PropertyPage from './components/PropertyPage'

export default function App() {

  const [route, setRoute] = useState("dashboard")

  return (
    <div>
      <nav style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #eee"}}>
        <button onClick={()=>setRoute("dashboard")}>Dashboard</button>
        <button onClick={()=>setRoute("property")}>Property Page</button>
      </nav>
      {route==="dashboard" ? <ManagerDashboard/> : <PropertyPage/>}
    </div>
  )
}
