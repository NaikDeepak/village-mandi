import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { RulesPage } from './pages/RulesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BuyerLoginPage } from './pages/BuyerLoginPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/buyer-login" element={<BuyerLoginPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected buyer routes */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <BuyerDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
