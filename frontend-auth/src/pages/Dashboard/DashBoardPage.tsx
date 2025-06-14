// src/pages/Dashboard/DashBoardPage.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getAllProducts } from '../../api/product';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';

interface Product {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
}

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log("Datos recibidos de la API:", data);
        setProducts(data);
        
        // Filtrar productos de electrónica y ordenar por precio (más baratos primero)
        const electronicsProducts = data
          .filter((product: Product) => 
            product.categoryName?.toLowerCase().includes('electr') || 
            product.categoryName?.toLowerCase() === 'electronica'
          )
          .sort((a: Product, b: Product) => a.price - b.price)
          .slice(0, 10); // Tomar los primeros 10
        
        setFeaturedProducts(electronicsProducts);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
       <h1 className="hero-title">
  <span className="hero-icon">
    <span className="bag-handle"></span>
    <span className="secondary-bag"></span>
  </span>
  Bienvenido a MixStore
</h1>
            <p className="hero-subtitle">Descubre los mejores productos tecnológicos al mejor precio</p>
          </div>
        </div>

        {/* Featured Products Carousel */}
        <div className="featured-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon"></span>
              Lo más vendido de Electrónica
            </h2>
            <p className="section-subtitle">Los mejores precios en productos tecnológicos</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos destacados...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
           <div className="no-products">
  <span className="no-products-icon">
    <span></span>
    <span></span>
    <span></span>
  </span>
  <p>No hay productos de electrónica disponibles</p>
</div>
          ) : (
            <div className="carousel-container">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={15}
                slidesPerView={1}
                navigation
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true 
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  480: { slidesPerView: 1.5, spaceBetween: 15 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 2.5, spaceBetween: 15 },
                  1024: { slidesPerView: 3.5, spaceBetween: 15 },
                  1200: { slidesPerView: 4, spaceBetween: 15 },
                }}
                className="featured-swiper"
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product.productId}>
                    <div className="featured-card" onClick={() => handleProductClick(product.productId)}>
                      <div className="featured-card-image">
                        <img 
                          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                          alt={product.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                        <div className="featured-badge">
                          <span className="badge-text">⭐ Destacado</span>
                        </div>
                      </div>
                      <div className="featured-card-content">
                        <h3 className="featured-product-name">{product.name}</h3>
                        <div className="featured-price-container">
                          <span className="featured-price">${product.price.toFixed(2)}</span>
                          <span className="price-label">Mejor precio</span>
                        </div>
                        <div className="featured-category">
                          <span className="category-icon">🔌</span>
                          {product.categoryName}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* All Products Grid */}
        <div className="all-products-section">
          <div className="section-header">
           <h2 className="section-title">
  <span className="section-icon2">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </span>
  Todos nuestros productos
</h2>
            <p className="section-subtitle">Explora toda nuestra colección</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando catálogo completo...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
  <span className="no-products-icon">
    <span></span>
    <span></span>
    <span></span>
  </span>
  <p className='texto'>No hay productos de electrónica disponibles</p>
</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div 
                  key={product.productId} 
                  className="product-card-small"
                  onClick={() => handleProductClick(product.productId)}
                >
                  <div className="product-image-small">
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/200x150?text=No+Image'} 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="product-info-small">
                    <h4 className="product-name-small">{product.name}</h4>
                    <div className="product-details-small">
                      <span className="product-price-small">${product.price.toFixed(2)}</span>
                      {product.categoryName && (
                        <span className="product-category-small">{product.categoryName}</span>
                      )}
                    </div>
               <button className="product-button-small">
  <span className="button-icon"></span>
  Ver detalles
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;