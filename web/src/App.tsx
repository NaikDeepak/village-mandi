import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { RulesPage } from './pages/RulesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rules" element={<RulesPage />} />
        {/* Placeholder for future routes */}
        <Route path="/login" element={<div className="flex items-center justify-center h-screen">Login Page Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
