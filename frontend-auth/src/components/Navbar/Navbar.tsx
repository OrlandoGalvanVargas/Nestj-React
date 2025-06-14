import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, getUser, removeSession } from '../../utils/auth';
import './Navbar.css';

const Navbar: React.FC = () => {
  const token = getToken();
  const user = getUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    removeSession();
    navigate('/');
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