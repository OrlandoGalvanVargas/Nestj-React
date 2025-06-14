import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getCouponById, updateCoupon, Coupon } from '../../api/coupon';
import Navbar from '../../components/Navbar/Navbar';
import './UpdateCoupon.css'; // Reutilizamos los estilos del formulario de agregar
import CustomSuccessModal from '../../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../../components/Modal/CustomErrorModal';

interface CouponFormData {
  couponCode: string;
  discountAmount: number;
  minAmount: number;
  amountType: 'Percentage' | 'Fixed';
  limitUser: number;
  dateInit: string;
  dateEnd: string;
  category: string;
  stateCoupon: boolean;
}

const categories = ['General', 'Electrónica', 'Ropa', 'Hogar', 'Juguetes', 'Deportes', 'Belleza', 'Alimentos', 'Libros', 'Mascotas', 'Oficina'];

const UpdateCoupon: React.FC = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<CouponFormData>();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const navigate = useNavigate();

  const watchedAmountType = watch('amountType');

  // Función para formatear fecha para input date
  const formatDateForInput = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Cargar datos del cupón al montar el componente
  useEffect(() => {
    const loadCouponData = async () => {
      if (!couponId) {
        setErrorMessage('ID de cupón no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getCouponById(parseInt(couponId));
        
        if (response.isSuccess && response.result) {
          const coupon = response.result;
          setCurrentCoupon(coupon);

          // Precargar los datos en el formulario
          reset({
            couponCode: coupon.couponCode,
            discountAmount: coupon.discountAmount,
            minAmount: coupon.minAmount,
            amountType: coupon.amountType,
            limitUser: coupon.limitUser,
            dateInit: formatDateForInput(coupon.dateInit),
            dateEnd: formatDateForInput(coupon.dateEnd),
            category: coupon.category,
            stateCoupon: coupon.stateCoupon
          });
        } else {
          setErrorMessage('No se pudo cargar la información del cupón');
        }
      } catch (error: any) {
        console.error('Error al cargar cupón:', error);
        setErrorMessage(error.message || 'Error al cargar el cupón');
      } finally {
        setIsLoading(false);
      }
    };

    loadCouponData();
  }, [couponId, reset]);

  const onSubmit = async (data: CouponFormData) => {
    if (!currentCoupon) {
      setErrorMessage('No se ha cargado la información del cupón');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Preparar los datos en el formato requerido para actualización
      const couponData: Coupon = {
        couponId: currentCoupon.couponId,
        couponCode: data.couponCode,
        discountAmount: data.discountAmount,
        minAmount: data.minAmount,
        lastUpdated: new Date().toISOString(),
        amountType: data.amountType,
        limitUser: data.limitUser,
dateInit: new Date(`${data.dateInit}T00:00:00`).toISOString(),
dateEnd: new Date(`${data.dateEnd}T00:00:00`).toISOString(),

        category: data.category,
        stateCoupon: data.stateCoupon
      };

      const response = await updateCoupon(couponData);
      
      if (response.isSuccess) {
        setSuccessMessage('¡Cupón actualizado correctamente!');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/edit-coupons');
        }, 1000);
      } else {
        setErrorMessage(response.message || 'Error al actualizar el cupón');
      }
      
    } catch (error: any) {
      console.error('Error al actualizar cupón:', error);
      const message = error.message || 'Error al actualizar el cupón, por favor intente más tarde';
      setErrorMessage(message);

      // Cerrar el modal automáticamente después de 2.5 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener la fecha actual para las validaciones
  const today = new Date().toISOString().split('T')[0];

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="add-coupon-page-container">
          <div className="coupon-form-container">
            <div className="form-wrapper">
              <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Cargando información del cupón...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="add-coupon-page-container">
        {/* Botón de regresar */}
        <button className="back-button" onClick={() => navigate('/edit-coupons')}>
          ← Regresar
        </button>
        
        <div className="coupon-form-container">
          <div className="form-wrapper">
            <h2>Actualizar Cupón</h2>
            {currentCoupon && (
              <p className="coupon-id-info">
                Editando cupón ID: <strong>{currentCoupon.couponId}</strong>
              </p>
            )}
            
            {errorMessage && (
              <CustomErrorModal
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            )}
            
            {successMessage && (
              <CustomSuccessModal
                message={successMessage}
                onClose={() => setSuccessMessage('')}
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Código del cupón (sin botón generar en actualización) */}
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Código del cupón"
                  {...register('couponCode', { required: 'Este campo es requerido' })}
                  className={errors.couponCode ? 'input-error' : ''}
                />
                {errors.couponCode && <span className="error-text">{errors.couponCode.message}</span>}
              </div>

              {/* Tipo de descuento y monto */}
              <div className="double-input">
                <div className="input-box">
                  <select
                    {...register('amountType', { required: 'Este campo es requerido' })}
                    className={errors.amountType ? 'input-error' : ''}
                  >
                    <option value="Percentage">Porcentaje (%)</option>
                    <option value="Fixed">Monto Fijo ($)</option>
                  </select>
                  {errors.amountType && <span className="error-text">{errors.amountType.message}</span>}
                </div>

                <div className="input-box">
                  <input
                    type="number"
                    step="0.01"
                    placeholder={watchedAmountType === 'Percentage' ? 'Descuento (%)' : 'Descuento ($)'}
                    {...register('discountAmount', { 
                      required: 'Este campo es requerido',
                      min: { value: 0.01, message: 'El descuento debe ser mayor a 0' },
                      max: watchedAmountType === 'Percentage' ? 
                        { value: 100, message: 'El porcentaje no puede ser mayor a 100%' } : 
                        undefined
                    })}
                    className={errors.discountAmount ? 'input-error' : ''}
                  />
                  {errors.discountAmount && <span className="error-text">{errors.discountAmount.message}</span>}
                </div>
              </div>

              {/* Monto mínimo y límite de usuarios */}
              <div className="double-input">
                <div className="input-box">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Monto mínimo de compra"
                    {...register('minAmount', { 
                      required: 'Este campo es requerido',
                      min: { value: 0, message: 'El monto no puede ser negativo' }
                    })}
                    className={errors.minAmount ? 'input-error' : ''}
                  />
                  {errors.minAmount && <span className="error-text">{errors.minAmount.message}</span>}
                </div>

                <div className="input-box">
                  <input
                    type="number"
                    placeholder="Límite de usuarios"
                    {...register('limitUser', { 
                      required: 'Este campo es requerido',
                      min: { value: 1, message: 'Debe permitir al menos 1 usuario' }
                    })}
                    className={errors.limitUser ? 'input-error' : ''}
                  />
                  {errors.limitUser && <span className="error-text">{errors.limitUser.message}</span>}
                </div>
              </div>

              {/* Fechas de inicio y fin */}
              <div className="double-input">
                <div className="input-box">
                  <label htmlFor="dateInit">Fecha de inicio:</label>
                  <input
                    id="dateInit"
                    type="date"
                    {...register('dateInit', { 
                      required: 'Este campo es requerido'
                    })}
                    className={errors.dateInit ? 'input-error' : ''}
                  />
                  {errors.dateInit && <span className="error-text">{errors.dateInit.message}</span>}
                </div>

                <div className="input-box">
                  <label htmlFor="dateEnd">Fecha de fin:</label>
                  <input
                    id="dateEnd"
                    type="date"
                    {...register('dateEnd', { 
                      required: 'Este campo es requerido',
                      validate: (value, formValues) => {
                        if (formValues.dateInit && value <= formValues.dateInit) {
                          return 'La fecha de fin debe ser posterior a la fecha de inicio';
                        }
                        return true;
                      }
                    })}
                    className={errors.dateEnd ? 'input-error' : ''}
                  />
                  {errors.dateEnd && <span className="error-text">{errors.dateEnd.message}</span>}
                </div>
              </div>

              {/* Categoría */}
              <div className="input-box">
                <select
                  {...register('category', { required: 'Este campo es requerido' })}
                  className={errors.category ? 'input-error' : ''}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category.message}</span>}
              </div>

              {/* Estado del cupón */}
              <div className="input-box checkbox-box">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register('stateCoupon')}
                  />
                  <span className="checkmark"></span>
                  Cupón activo
                </label>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => navigate('/edit-coupons')}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Cupón'}
                </button>
              </div>
            </form>
          </div>

          {/* Panel de información del cupón */}
          <div className="coupon-info-container">
            <h3>Información del Cupón</h3>
            <div className="info-content">
              <div className="info-item">
                <strong>Tipo de Descuento:</strong>
                <span>{watchedAmountType === 'Percentage' ? 'Porcentaje' : 'Monto Fijo'}</span>
              </div>
              {currentCoupon && (
                <div className="info-item">
                  <strong>Última actualización:</strong>
                  <span>{new Date(currentCoupon.lastUpdated).toLocaleDateString()}</span>
                </div>
              )}
              <div className="info-tip">
                <p><strong>Consejos:</strong></p>
                <ul>
                  <li>Verifique que el código siga siendo único</li>
                  <li>Actualice las fechas según sea necesario</li>
                  <li>Revise los límites de usuarios disponibles</li>
                  <li>Confirme el estado del cupón antes de guardar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCoupon;