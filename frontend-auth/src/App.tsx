import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPages';
import RegisterPage from './pages/Register/RegisterPage';
import DashboardPage from './pages/Dashboard/DashBoardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage';
import AddProduct from './pages/AddProduct/AddProduct';
import EditProduct from './pages/EditProduct';
import UpdateProduct from './pages/UpdateProduct/UpdateProduct'; // Asegúrate de importar el nuevo componente
import Coupon from './pages/Coupon/Coupon';
import AddCoupon from './pages/AddCoupon/AddCoupon';
import UpdateCoupon from './pages/UpdateCoupon/UpdateCoupon';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />        
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/add-product" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AddProduct />
            </ProtectedRoute>
          } 
        />
            <Route 
          path="/add-coupon" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AddCoupon />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/update-product/:productId" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UpdateProduct />
            </ProtectedRoute>
          } 
        />
            <Route 
          path="/update-coupon/:couponId" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UpdateCoupon />
            </ProtectedRoute>
          } 
        />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route 
          path="/edit-product" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <EditProduct />
            </ProtectedRoute>
          } 
        />

           <Route 
          path="/edit-coupons" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Coupon />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;