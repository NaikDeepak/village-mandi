import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Placeholder for future routes */}
        <Route path="/login" element={<div className="flex items-center justify-center h-screen">Login Page Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
