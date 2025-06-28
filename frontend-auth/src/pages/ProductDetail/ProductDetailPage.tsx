import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { deleteProduct, getProductById } from '../../api/product';
import CustomDeleteModal from '../../components/Modal/CustomDeleteModal';
import CustomSuccessModal from '../../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../../components/Modal/CustomErrorModal';
import './ProductDetailPage.css';
import { cartUpsert } from '../../api/shopping-cart';

interface Product {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  stock?: number;
  categoryName?: string;
  brand?: string;
  rating?: number;
  discount?: number;
  specifications?: {
    key: string;
    value: string;
  }[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const user = getUser();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.roles?.includes('ADMIN');
const [quantity, setQuantity] = useState(1);
const [isAddingToCart, setIsAddingToCart] = useState(false);
const [showCartSuccessModal, setShowCartSuccessModal] = useState(false);
const [cartSuccessMessage, setCartSuccessMessage] = useState('');

useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('ID de producto no proporcionado');
        }
        const productData = await getProductById(parseInt(id));
        setProduct(productData);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        setError('No se pudo cargar el producto. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // useEffect adicional para manejar el modal de éxito del carrito
useEffect(() => {
  if (showCartSuccessModal) {
    const timer = setTimeout(() => {
      setShowCartSuccessModal(false);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [showCartSuccessModal]);

// Función para manejar el cambio de cantidad
const handleQuantityChange = (newQuantity: number) => {
  if (newQuantity >= 1 && (product?.stock === undefined || newQuantity <= product.stock)) {
    setQuantity(newQuantity);
  }
};

// Agrega esta función al final de tu handleAddToCart en ProductDetailPage.tsx

const handleAddToCart = async () => {
  if (!user || !product) return;
  
  setIsAddingToCart(true);
  try {
    const response = await cartUpsert(user.id, product.productId, quantity);
    
    if (response.isSuccess) {
      setCartSuccessMessage(`${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
      setShowCartSuccessModal(true);
      
      // ✨ NUEVA LÍNEA: Actualizar el contador del carrito en el navbar
      if ((window as any).refreshNavbarCart) {
        (window as any).refreshNavbarCart();
      }
    } else {
      setErrorMessage(response.message || 'Error al agregar al carrito');
      setShowErrorModal(true);
    }
  } catch (error) {
    setErrorMessage(error instanceof Error ? error.message : 'Error al agregar al carrito');
    setShowErrorModal(true);
  } finally {
    setIsAddingToCart(false);
  }
};

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/'); // Redirige a la página principal después de eliminar
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, navigate]);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.productId);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Ocurrió un error al eliminar el producto');
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="pd-loading-container">
        <div className="pd-loading-spinner"></div>
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-error-container">
        <span className="pd-error-icon">⚠️</span>
        <p className="pd-error-message">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <span className="pd-not-found-icon">🔍</span>
        <p>Producto no encontrado</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pd-main-container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Inicio</Link> &gt; <span>{product.categoryName || 'Categoría'}</span> &gt; <span>{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="pd-product-section">
          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'} 
                alt={product.name} 
                className="pd-product-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="pd-product-info">
            <h1 className="pd-product-title">{product.name}</h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="pd-rating">
                <span className="pd-stars">{"★".repeat(Math.round(product.rating)).padEnd(5, "☆")}</span>
                <span className="pd-rating-count">{product.rating.toFixed(1)}</span>
              </div>
            )}

            {/* Price */}
            <div className="pd-price-container">
              {product.discount ? (
                <>
                  <span className="pd-original-price">${(product.price / (1 - product.discount / 100)).toFixed(2)}</span>
                  <span className="pd-discount">-{product.discount}%</span>
                  <span className="pd-final-price">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="pd-final-price">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <div className="pd-stock">
                <span className={product.stock > 10 ? "pd-in-stock" : product.stock > 0 ? "pd-low-stock" : "pd-out-of-stock"}>
                  {product.stock > 10 ? "Disponible" : product.stock > 0 ? "Últimas unidades" : "Agotado"}
                </span>
                {product.stock > 0 && (
                  <span className="pd-stock-count">({product.stock} disponibles)</span>
                )}
              </div>
            )}

            {/* Brand */}
            {product.brand && (
              <div className="pd-brand">
                <span>Marca:</span> {product.brand}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="pd-description">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}

<div className="pd-actions">
  {/* Selector de cantidad */}
  <div className="pd-quantity-section">
    <label htmlFor="quantity" className="pd-quantity-label">Cantidad:</label>
    <div className="pd-quantity-controls">
      <button 
        className="pd-quantity-btn pd-quantity-decrease"
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={quantity <= 1}
        type="button"
      >
        -
      </button>
      <input
        id="quantity"
        type="number"
        className="pd-quantity-input"
        value={quantity}
        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
        min="1"
        max={product?.stock || 999}
        disabled={!isLoggedIn}
      />
      <button 
        className="pd-quantity-btn pd-quantity-increase"
        onClick={() => handleQuantityChange(quantity + 1)}
        disabled={!isLoggedIn || (product?.stock !== undefined && quantity >= product.stock)}
        type="button"
      >
        +
      </button>
    </div>
  </div>

  {/* Botón de comprar */}
  <button 
    className={`pd-buy-button ${!isLoggedIn || isAddingToCart ? 'pd-disabled' : ''}`}
    disabled={!isLoggedIn || isAddingToCart || (product?.stock !== undefined && product.stock <= 0)}
    onClick={handleAddToCart}
    title={
      !isLoggedIn 
        ? "Debes iniciar sesión para comprar" 
        : (product?.stock !== undefined && product.stock <= 0)
        ? "Producto agotado"
        : ""
    }
  >
    {isAddingToCart ? '🔄 Agregando...' : '🛒 Agregar al carrito'}
  </button>
  
  {isAdmin && (
    <div className="pd-admin-actions">
      <button 
        className="pd-edit-button"
        onClick={() => navigate(`/update-product/${product.productId}`)}
        title="Editar producto"
      >
        ✏️ Editar
      </button>
      <button
        className="pd-delete-button"
        onClick={() => handleDeleteClick(product)}
        title="Eliminar producto"
      >
        🗑️ Eliminar
      </button>
    </div>
  )}
</div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="pd-specs-section">
            <h2 className="pd-section-title">Especificaciones</h2>
            <div className="pd-specs-grid">
              {product.specifications.map((spec, index) => (
                <div key={index} className="pd-spec-item">
                  <span className="pd-spec-key">{spec.key}:</span>
                  <span className="pd-spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products (placeholder) */}
        <div className="pd-related-section">
          <h2 className="pd-section-title">Productos relacionados</h2>
          <div className="pd-related-grid">
            {/* Aquí irían productos relacionados */}
            <div className="pd-related-placeholder">
              <p>Productos similares que podrían interesarte</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showDeleteModal && productToDelete && (
        <CustomDeleteModal
        tipe={"Producto"}
          productName={productToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={isDeleting}
        />
      )}

      {showSuccessModal && (
        <CustomSuccessModal
          title="Producto Eliminado"
          message="El producto ha sido eliminado exitosamente del sistema."
          onClose={handleSuccessClose}
        />
      )}
{showCartSuccessModal && (
  <CustomSuccessModal
    title="Producto Agregado"
    message={cartSuccessMessage}
    onClose={() => setShowCartSuccessModal(false)}
  />
)}
      {showErrorModal && (
        <CustomErrorModal
          title="Error al Eliminar"
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default ProductDetailPage;