import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Saved from './pages/Saved'
import Digest from './pages/Digest'
import Settings from './pages/Settings'
import Proof from './pages/Proof'

import './styles/global.css'
import './styles/components.css'
import './styles/navigation.css'
import './styles/pages.css'
import './styles/jobs.css'
import './styles/scoring.css'
import './styles/digest.css'
import './styles/status.css'
import './styles/proof.css'

function App() {
  return (
    <BrowserRouter basename="/kodnest-premium-build-system">
      <div className="app-layout">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/digest" element={<Digest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/proof" element={<Proof />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
