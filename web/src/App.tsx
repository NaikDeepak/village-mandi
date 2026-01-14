import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { BuyerLoginPage } from './pages/BuyerLoginPage';
import { LandingPage } from './pages/LandingPage';
import { RulesPage } from './pages/RulesPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';

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
  );
}

export default App;
