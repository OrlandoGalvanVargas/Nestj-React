import React, { useEffect, useState } from 'react';
import { getAllCoupons, getCouponById, getCouponByCode, deleteCoupon, Coupon as CouponType } from '../../api/coupon';
import CustomDeleteModal from '../../components/Modal/CustomDeleteModal';
import CustomSuccessModal from '../../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../../components/Modal/CustomErrorModal';
import Navbar from '../../components/Navbar/Navbar';
import './Coupon.css';
import { useNavigate } from 'react-router-dom';

const Coupon: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<CouponType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'code' | 'id'>('code');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<CouponType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const fetchAllCoupons = async () => {
    try {
      setLoading(true);
      const response = await getAllCoupons();
      if (response.isSuccess) {
        setCoupons(response.result);
        setFilteredCoupons(response.result);
      } else {
        setErrorMessage(response.message || 'Error al obtener los cupones');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al obtener los cupones');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredCoupons(coupons);
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (searchType === 'code') {
        response = await getCouponByCode(searchTerm.trim());
      } else {
        const id = parseInt(searchTerm.trim());
        if (isNaN(id)) {
          setErrorMessage('El ID debe ser un número válido');
          setShowErrorModal(true);
          setLoading(false);
          return;
        }
        response = await getCouponById(id);
      }

      if (response.isSuccess) {
        setFilteredCoupons([response.result]);
      } else {
        setErrorMessage(response.message || 'Cupón no encontrado');
        setShowErrorModal(true);
        setFilteredCoupons([]);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error en la búsqueda');
      setShowErrorModal(true);
      setFilteredCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredCoupons(coupons);
  };

  useEffect(() => {
    fetchAllCoupons();
  }, []);

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

  const handleDeleteClick = (coupon: CouponType) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete?.couponId) return;

    setIsDeleting(true);
    try {
      const response = await deleteCoupon(couponToDelete.couponId);
      if (response.isSuccess) {
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        await fetchAllCoupons(); // Recargar datos
      } else {
        setErrorMessage(response.message || 'Error al eliminar el cupón');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar el cupón');
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
      setCouponToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, type: 'Percentage' | 'Fixed') => {
    if (type === 'Percentage') {
      return `${amount}%`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const isExpired = (dateEnd: string | Date) => {
    return new Date(dateEnd) < new Date();
  };

  return (
    <>
      <Navbar />
      <div className="coupon-container2">
        <div className="header-section2">
          <h2 className="page-title2">
            <span className="title-icon2"></span>
            Gestión de Cupones
          </h2>
          <div className="header-actions">
            <button 
              className="add-coupon-button"
              onClick={() => navigate('/add-coupon')}
            >
              <span className="button-iconAdd2"></span>
              Agregar Cupón
            </button>
          </div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <div className="search-type-selector">
              <button
                className={`search-type-btn ${searchType === 'code' ? 'active' : ''}`}
                onClick={() => setSearchType('code')}
              >
                🏷️ Por Código
              </button>
       
            </div>
            <div className="search-input-group">
              <input
                type={searchType === 'id' ? 'number' : 'text'}
                placeholder={searchType === 'code' ? 'Buscar por código...' : 'Buscar por ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className="search-button"
                onClick={handleSearch}
                disabled={loading}
                title="Buscar"
              >
              </button>
              <button 
                className="clear-button"
                onClick={handleClearSearch}
                title="Limpiar búsqueda"
              >
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Cargando cupones...</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="coupon-table">
                <thead>
                  <tr>
                 <th>
  <div className="th-content">
    <span className="th-icon id-icon"></span>
    N°
  </div>
</th>

                    <th>
                      <div className="th-content">
                        <span className="th-icon code-icon"></span>
                        Código
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span className="th-icon discount-icon"></span>
                        Descuento
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span className="th-icon amount-icon"></span>
                        Monto Mín.
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span className="th-icon limit-icon"></span>
                        Límite
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span className="th-icon date-icon"></span>
                        Vigencia
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
                        <span className="th-icon status-icon"></span>
                        Estado
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
                  {filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon, index) => (
                      <tr key={coupon.couponId} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                        <td className="id-cell">
  <div className="coupon-id">#{index + 1}</div>
                        </td>
                        <td className="code-cell">
                          <div className="coupon-code">{coupon.couponCode}</div>
                        </td>
                        <td className="discount-cell">
                          <div className={`discount-badge ${coupon.amountType.toLowerCase()}`}>
                            {formatCurrency(coupon.discountAmount, coupon.amountType)}
                          </div>
                        </td>
                        <td className="min-amount-cell">
                          <div className="min-amount">${coupon.minAmount.toFixed(2)}</div>
                        </td>
                        <td className="limit-cell">
                          <div className="user-limit">
                            {coupon.limitUser === 0 ? '∞' : coupon.limitUser}
                          </div>
                        </td>
                        <td className="dates-cell">
                          <div className="date-range">
                            <div className="date-start">📅 {formatDate(coupon.dateInit)}</div>
                            <div className="date-end">⏰ {formatDate(coupon.dateEnd)}</div>
                          </div>
                        </td>
                        <td className="category-cell">
                          <div className="category-badge">
                            {coupon.category}
                          </div>
                        </td>
                        <td className="status-cell">
                          <div className={`status-badge ${
                            !coupon.stateCoupon ? 'inactive' : 
                            isExpired(coupon.dateEnd) ? 'expired' : 'active'
                          }`}>
                            {!coupon.stateCoupon ? '🔴 Inactivo' : 
                             isExpired(coupon.dateEnd) ? '⏰ Expirado' : '🟢 Activo'}
                          </div>
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button 
                              className="edit-button"
                              onClick={() => navigate(`/update-coupon/${coupon.couponId}`)}
                              title="Editar cupón"
                            >
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteClick(coupon)}
                              title="Eliminar cupón"
                            >
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="no-data">
                        <div className="no-data-content">
                          <span className="no-data-icon"></span>
                          <p>No se encontraron cupones</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modales */}
        {showDeleteModal && couponToDelete && (
          <CustomDeleteModal
            tipe={"Cupon"}
            productName={couponToDelete.couponCode}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isLoading={isDeleting}
          />
        )}

        {showSuccessModal && (
          <CustomSuccessModal
            title="Cupón Eliminado"
            message="El cupón ha sido eliminado exitosamente del sistema."
            onClose={() => setShowSuccessModal(false)}
          />
        )}

        {showErrorModal && (
          <CustomErrorModal
            title="Error"
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Coupon;