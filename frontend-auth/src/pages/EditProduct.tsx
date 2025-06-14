import React, { useEffect, useState } from 'react';
import { getPaginatedProducts, deleteProduct } from '../api/product';
import CustomDeleteModal from '../components/Modal/CustomDeleteModal';
import CustomSuccessModal from '../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../components/Modal/CustomErrorModal';
import Navbar from '../components/Navbar/Navbar';
import './EditProduct.css';
import { useNavigate } from 'react-router-dom';

interface Product {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string;
}

const EditProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recordsPerPage = 5;
  const navigate = useNavigate();

  const fetchProducts = async (page: number) => {
    try {
      const result = await getPaginatedProducts({
        page,
        recordsPerPage,
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      setProducts(result.products);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
      await fetchProducts(currentPage);
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
  };

  return (
    <>
      <Navbar />
      <div className="edit-product-container">
        <div className="header-section">
        <h2 className="page-title">
  <span className="title-icon"></span>
  Gestión de Productos
</h2>
          <div className="add-button-container">
        <button className="add-product-button" onClick={() => navigate('/add-product')}>
  <span className="button-iconAdd"></span>
  Agregar Producto
</button>
          </div>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>
                  <div className="th-content">
    <span className="th-icon image-icon"></span>
    Imagen
  </div>
                  </th>
                  <th>
                     <div className="th-content">
    <span className="th-icon name-icon"></span>
    Nombre
  </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <span className="th-icon price-icon"></span>
                      Precio
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <span className="th-icon stock-icon"></span>
                      Stock
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <span className="th-icon category-icon"></span>
                      Categoría
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <span className="th-icon actions-icon"></span>
                      Acciones
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, index) => (
                  <tr key={prod.productId} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <td className="image-cell">
                      <div className="image-container">
                        <img src={prod.imageUrl} alt={prod.name} className="product-image" />
                      </div>
                    </td>
                    <td className="name-cell">
                      <div className="product-name">{prod.name}</div>
                    </td>
                    <td className="price-cell">
                      <div className="price-tag">${prod.price.toFixed(2)}</div>
                    </td>
                    <td className="stock-cell">
                      <div className={`stock-badge ${prod.stock <= 5 ? 'low-stock' : prod.stock <= 15 ? 'medium-stock' : 'high-stock'}`}>
                        {prod.stock}
                      </div>
                    </td>
                    <td className="category-cell">
                      <div className="category-badge">
                        {prod.categoryName}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="edit-button"
  onClick={() => navigate(`/update-product/${prod.productId}`)}
                          title="Editar producto"
                        >
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteClick(prod)}
                          title="Eliminar producto"
                        >
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination-section">
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            >
  <span className="pagination-icon prev"></span>
              Anterior
            </button>

            <div className="pagination-info">
              <span className="page-indicator">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              Siguiente
  <span className="pagination-icon next"></span>
            </button>
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

        {showErrorModal && (
          <CustomErrorModal
            title="Error al Eliminar"
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default EditProduct;