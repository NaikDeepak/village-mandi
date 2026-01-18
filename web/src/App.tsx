import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { BuyerLoginPage } from './pages/BuyerLoginPage';
import { LandingPage } from './pages/LandingPage';
import { RulesPage } from './pages/RulesPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { BatchDetailPage } from './pages/admin/BatchDetailPage';
import { BatchFormPage } from './pages/admin/BatchFormPage';
import { BatchPackingPage } from './pages/admin/BatchPackingPage';
import { BatchPayoutsPage } from './pages/admin/BatchPayoutsPage';
import { BatchProcurementPage } from './pages/admin/BatchProcurementPage';
import { BatchesPage } from './pages/admin/BatchesPage';
import { FarmerDetailPage } from './pages/admin/FarmerDetailPage';
import { FarmerFormPage } from './pages/admin/FarmerFormPage';
import { FarmersPage } from './pages/admin/FarmersPage';
import { OrderDetailPage } from './pages/admin/OrderDetailPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { ProductFormPage } from './pages/admin/ProductFormPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { EditOrderPage } from './pages/buyer/EditOrderPage';
import { OrderSuccessPage } from './pages/buyer/OrderSuccessPage';
import { ShopPage } from './pages/buyer/ShopPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/buyer-login" element={<BuyerLoginPage />} />

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
              <Route path="batches/:id/procurement" element={<BatchProcurementPage />} />
              <Route path="batches/:id/packing" element={<BatchPackingPage />} />
              <Route path="batches/:id/payouts" element={<BatchPayoutsPage />} />
              <Route path="farmers" element={<FarmersPage />} />
              <Route path="farmers/new" element={<FarmerFormPage />} />
              <Route path="farmers/:id" element={<FarmerDetailPage />} />
              <Route path="farmers/:id/edit" element={<FarmerFormPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
            </Route>

            {/* Protected buyer routes */}
            <Route
              path="/shop"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <ShopPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/checkout"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/order-success"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId/edit"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <EditOrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['BUYER']}>
                  <BuyerDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
