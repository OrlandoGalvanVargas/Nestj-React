// src/pages/ShoppingCart/ShoppingCartPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getUser } from '../../utils/auth';
import { 
  getCart, 
  cartUpsert, 
  removeCartItem, 
  removeCartItemCompletely,
  CartDto, 
  CartDetailsDto, 
  applyCoupon
} from '../../api/shopping-cart';
import './ShoppingCartPage.css';
import Navbar from '../../components/Navbar/Navbar';

const ShoppingCartPage: React.FC = () => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getUser();
  const token = getToken();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    if (!token || !user?.id) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getCart(user.id);
        setCart(response.result);
      } catch (err) {
        setError('Error al cargar el carrito');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, token, user?.id]);

  const calculateTotal = () => {
    if (!cart?.cartDetailsDtos?.length) return 0;
    return cart.cartDetailsDtos.reduce(
      (total, item) => total + (item.productDto?.price || 0) * item.count,
      0
    );
  };

  const refreshCart = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await getCart(user.id);
      setCart(response.result);
    } catch (err) {
      setError('Error al actualizar el carrito');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!user?.id || !couponCode.trim()) {
      setCouponMessage('Ingresa un código de cupón válido');
      return;
    }
    try {
      setLoading(true);
      const response = await applyCoupon(user.id, couponCode.trim());
      
      if (response.result) {
        setCouponMessage('¡Cupón aplicado correctamente!');
        setCouponCode('');
        await refreshCart();
      } else {
        setCouponMessage(response.message || 'No se pudo aplicar el cupón');
      }
    } catch (err) {
      setCouponMessage('Error al aplicar el cupón');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = async (item: CartDetailsDto) => {
    if (!user?.id || !item.cartDetailsId) return;
    
    try {
      if (item.count > 1) {
        await cartUpsert(user.id, item.productId, -1);
      } else {
        await removeCartItem(item.cartDetailsId);
      }
      await refreshCart();
    } catch (err) {
      setError('Error al actualizar la cantidad');
      console.error(err);
    }
  };

  const handleIncreaseQuantity = async (productId: number) => {
    if (!user?.id) return;
    
    try {
      await cartUpsert(user.id, productId, 1);
      await refreshCart();
    } catch (err) {
      setError('Error al aumentar la cantidad');
      console.error(err);
    }
  };

  const handleRemoveItem = async (cartDetailsId: number) => {
    if (!user?.id) return;
    
    try {
      await removeCartItemCompletely(cartDetailsId);
      await refreshCart();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    }
  };

  const calculateDiscount = () => {
    if (!cart?.cartHeader?.discount) return 0;
    return cart.cartHeader.discount;
  };

  const calculateFinalTotal = () => {
    return calculateTotal() - calculateDiscount();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Cargando tu carrito de compras...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="cart-error">{error}</div>
      </>
    );
  }

  if (!cart?.cartDetailsDtos?.length) {
    return (
      <>
        <Navbar />
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos para comenzar</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
          >
            Continuar comprando
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="shopping-cart-container">
        <h1>Tu Carrito de Compras</h1>
        
        <div className="cart-content">
          {/* Columna izquierda: Lista de productos */}
          <div className="cart-items-container">
            {cart.cartDetailsDtos.map((item) => (
              <div key={item.cartDetailsId} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.productDto?.imageUrl || 'https://via.placeholder.com/80'} 
                    alt={item.productDto?.name} 
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.productDto?.name}</h3>
                  <p className="item-description">{item.productDto?.description}</p>
                  <p className="item-category">{item.productDto?.categoryName}</p>
                </div>
                
                <div className="item-quantity">
                  <button 
                    className="quantity-btn minus" 
                    onClick={() => handleDecreaseQuantity(item)}
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="quantity">{item.count}</span>
                  <button 
                    className="quantity-btn plus" 
                    onClick={() => handleIncreaseQuantity(item.productId)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-price">
                  <p>${(item.productDto?.price || 0).toFixed(2)} c/u</p>
                  <p className="item-total">
                    Total: ${((item.productDto?.price || 0) * item.count).toFixed(2)}
                  </p>
                </div>
                
                <button 
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.cartDetailsId!)}
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          
          {/* Columna derecha: Resumen del carrito */}
          <div className="cart-summary">
            {/* Sección de cupón */}
            <div className="coupon-section">
              <label htmlFor="coupon-input">Cupón:</label>
              <div className="coupon-input-group">
                <input
                  id="coupon-input"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ingresa tu código"
                  disabled={loading || calculateDiscount() > 0}
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode.trim() || calculateDiscount() > 0}
                  className="apply-coupon-btn"
                >
                  Aplicar
                </button>
              </div>
              {couponMessage && (
                <p className={`coupon-message ${couponMessage.includes('¡') ? 'success' : 'error'}`}>
                  {couponMessage}
                  {calculateDiscount() > 0 && cart?.cartHeader?.couponCode && (
                    <span> 
                      (Cupón: {cart.cartHeader.couponCode} - 
                      {((calculateDiscount() / calculateTotal()) * 100).toFixed(0)}% de descuento)
                    </span>
                  )}
                </p>
              )}
            </div>
            
            {/* Resumen de costos */}
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            
            {calculateDiscount() > 0 && (
              <div className="summary-row discount">
                <span>Descuento ({((calculateDiscount() / calculateTotal()) * 100).toFixed(0)}%):</span>
                <span>-${calculateDiscount().toFixed(2)}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total a pagar:</span>
              <span>${calculateFinalTotal().toFixed(2)}</span>
            </div>
            
            <button className="checkout-btn">
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartPage;