import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import AdminMenu from './pages/AdminMenu'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UsersPage from './pages/UsersPage'
import { CartProvider, useCart } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'

function NavBar() {
  const { user } = useAuth();
  // useCart hook is available because NavBar is rendered inside <CartProvider>
  const { items } = useCart() || { items: [] }
  const count = (items || []).reduce((s,i)=>s + (i.qty||0), 0)
  return (
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h1><Link to={user ? "/" : "/login"}>Restaurant</Link></h1>
      {user && (
        <nav style={{display:'flex',gap:10,alignItems:'center'}}>
          <Link to="/cart" className="cart-link" aria-label="View cart">
            <span id="cart-icon" className="cart-icon" title="Cart">
              {/* simple cart SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
              <span className="cart-badge">{count}</span>
            </span>
          </Link>
        </nav>
      )}
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="container app-grid">
            <NavBar />
            <div className="content-area">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={
                    <PrivateRoute>
                      <MenuPage />
                    </PrivateRoute>
                  } />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/cart" element={
                    <PrivateRoute>
                      <CartPage />
                    </PrivateRoute>
                  } />
                  <Route path="/orders" element={
                    <PrivateRoute>
                      <OrdersPage />
                    </PrivateRoute>
                  } />
                  <Route path="/admin" element={
                    <PrivateRoute adminOnly>
                      <AdminMenu />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/users" element={
                    <PrivateRoute adminOnly>
                      <UsersPage />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
