import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, getUser, removeSession } from '../../utils/auth';
import { CartDetailsDto, getCart } from '../../api/shopping-cart';
import './Navbar.css';

const Navbar: React.FC = () => {
  const token = getToken();
  const user = getUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  const updateCartCount = useCallback(async () => {
    if (!user?.id) {
      setCartItemCount(0);
      return;
    }

    setIsLoadingCart(true);
    try {
      const response = await getCart(user.id);
      
      if (response && (response.result?.cartDetailsDtos || response.result?.cartDetailDto)) {
        const cartItems = response.result.cartDetailsDtos || response.result.cartDetailDto || [];
        const totalItems = cartItems.reduce(
          (total: number, item: CartDetailsDto) => total + (item.count || 0),
          0
        );
        setCartItemCount(totalItems);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      setCartItemCount(0);
    } finally {
      setIsLoadingCart(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (token && user) {
      updateCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [token, user?.id, updateCartCount]);

  const refreshCart = useCallback(() => {
    updateCartCount();
  }, [updateCartCount]);

  useEffect(() => {
    (window as any).refreshNavbarCart = refreshCart;
    
    return () => {
      delete (window as any).refreshNavbarCart;
    };
  }, [refreshCart]);

  const handleLogout = () => {
    removeSession();
    setCartItemCount(0);
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <div className="store-logo"></div>
          <h1 className="navbar-logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>MixStore</Link>
          </h1>
        </div>
        <nav className="navbar-links">
          <ul>
            {!token ? (
              <>
                <li>
                  <Link to="/login">
                    <span className="login-icon"></span> Login
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <span className="register-icon"></span> Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="navbar-user">
                  <span className="user-icon"></span> <strong>{user?.name}</strong>
                </li>

                <li className="cart-container">
                  <button 
                    onClick={handleCartClick} 
                    className="cart-button"
                    disabled={isLoadingCart}
                    title={isLoadingCart ? 'Cargando carrito...' : `${cartItemCount} productos en el carrito`}
                  >
                    <span className="cart-icon"></span>
                    Carrito
                    {/* Mostrar spinner cuando está cargando o badge cuando no está cargando */}
                    {isLoadingCart ? (
                      <span className="cart-loading-spinner"></span>
                    ) : (
                      cartItemCount > 0 && (
                        <span className="cart-badge">
                          {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                      )
                    )}
                  </button>
                </li>

                {user?.roles?.includes('ADMIN') && (
                  <li className="dropdown">
                    <span className="dropdown-toggle">
                      <span className="admin-icon"></span> Admin
                    </span>
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/edit-product">
                          <span>📦</span> Gestión de Productos
                        </Link>
                      </li>
                      <li>
                        <Link to="/edit-coupons">
                          <span>🎟️</span> Gestión de Cupones
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <span className="logout-icon"></span> Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;