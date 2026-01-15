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
import { AdminLayout } from './pages/admin/AdminLayout';
import { BatchDetailPage } from './pages/admin/BatchDetailPage';
import { BatchFormPage } from './pages/admin/BatchFormPage';
import { BatchesPage } from './pages/admin/BatchesPage';
import { FarmerDetailPage } from './pages/admin/FarmerDetailPage';
import { FarmerFormPage } from './pages/admin/FarmerFormPage';
import { FarmersPage } from './pages/admin/FarmersPage';
import { ProductFormPage } from './pages/admin/ProductFormPage';
import { ProductsPage } from './pages/admin/ProductsPage';

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
          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="batches" element={<BatchesPage />} />
            <Route path="batches/new" element={<BatchFormPage />} />
            <Route path="batches/:id" element={<BatchDetailPage />} />
            <Route path="batches/:id/edit" element={<BatchFormPage />} />
            <Route path="farmers" element={<FarmersPage />} />
            <Route path="farmers/new" element={<FarmerFormPage />} />
            <Route path="farmers/:id" element={<FarmerDetailPage />} />
            <Route path="farmers/:id/edit" element={<FarmerFormPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
          </Route>

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
