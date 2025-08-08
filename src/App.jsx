import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from "@/pages/Dashboard"
import Chat from "@/pages/Chat"
import LightspeedConnect from "@/pages/LightspeedConnect"
import LightspeedCallback from "@/pages/LightspeedCallback"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lightspeed/connect" element={<LightspeedConnect />} />
          <Route path="/lightspeed/callback" element={<LightspeedCallback />} />
        </Routes>
      </Router>
      
      <Toaster />
    </>
  )
}

export default App 