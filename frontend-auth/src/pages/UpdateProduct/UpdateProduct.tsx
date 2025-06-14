import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateProduct, getProductById } from '../../api/product';
import Navbar from '../../components/Navbar/Navbar';
import './UpdateProduct.css';
import CustomSuccessModal from '../../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../../components/Modal/CustomErrorModal';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryName: string;
  image?: FileList;
  currentImageUrl?: string;
  imageUrl?: string; // Para la imagen existente
}

const categories = ['Electrónica','Ropa','Hogar','Juguetes','Deportes','Belleza','Alimentos','Libros','Mascotas','Oficina'];

const UpdateProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<ProductFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const imageFile = watch('image');

  // Cargar los datos del producto al montar el componente
  useEffect(() => {
    const loadProductData = async () => {
      try {
        if (!productId) return;
        
        const product = await getProductById(parseInt(productId));
setCurrentProduct(product as ProductFormData);        
        // Establecer valores iniciales del formulario
        setValue('name', product.name);
        setValue('price', product.price);
        setValue('stock', product.stock);
        setValue('description', product.description || '');
        setValue('categoryName', product.categoryName || '');
        setValue('currentImageUrl', product.imageUrl);
        
        // Mostrar imagen actual si existe
        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setErrorMessage('Error al cargar los datos del producto');
        setTimeout(() => navigate('/edit-product'), 1000);
      }
    };

    loadProductData();
  }, [productId, setValue, navigate]);

  // Manejar cambios en la imagen seleccionada
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (currentProduct?.imageUrl) {
      // Si no hay nueva imagen pero hay una imagen existente, mostrarla
      setImagePreview(currentProduct.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile, currentProduct]);

  const onSubmit = async (data: ProductFormData) => {
    if (!productId) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
formData.append('description', data.description || '');      
formData.append('categoryName', data.categoryName);
      
      // Solo agregar la imagen si se seleccionó una nueva
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      await updateProduct(parseInt(productId), formData);

      setSuccessMessage('¡Producto actualizado correctamente!');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/edit-product');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      const message = error.response?.data?.message || 'Error al actualizar el producto, por favor intente más tarde';
      setErrorMessage(message);

      // Cerrar el modal automáticamente después de 2.5 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    // Si hay una imagen existente, esto permitirá al backend eliminarla
    // ya que no se enviará ninguna imagen nueva
  };

  if (!currentProduct) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <p>Cargando datos del producto...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="add-product-page-container">
        <button className="back-button" onClick={() => navigate('/edit-product')}>
          ← Regresar
        </button>
        
        <div className="product-form-container">
          <div className="form-wrapper">
            <h2>Editar Producto</h2>
            
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
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  {...register('name', { required: 'Este campo es requerido' })}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name.message}</span>}
              </div>

              <div className="double-input">
                <div className="input-box">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    {...register('price', { 
                      required: 'Este campo es requerido',
                      min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                    })}
                    className={errors.price ? 'input-error' : ''}
                  />
                  {errors.price && <span className="error-text">{errors.price.message}</span>}
                </div>

                <div className="input-box">
                  <input
                    type="number"
                    placeholder="Stock"
                    {...register('stock', { 
                      required: 'Este campo es requerido',
                      min: { value: 0, message: 'El stock no puede ser negativo' }
                    })}
                    className={errors.stock ? 'input-error' : ''}
                  />
                  {errors.stock && <span className="error-text">{errors.stock.message}</span>}
                </div>
              </div>

              <div className="input-box">
                <textarea
                  placeholder="Descripción"
                  rows={3}
                  {...register('description', { required: 'Este campo es requerido' })}
                  className={`text-area ${errors.description ? 'input-error' : ''}`}
                />
                {errors.description && <span className="error-text">{errors.description.message}</span>}
              </div>

              <div className="input-box">
                <select
                  {...register('categoryName', { required: 'Este campo es requerido' })}
                  className={errors.categoryName ? 'input-error' : ''}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.categoryName && <span className="error-text">{errors.categoryName.message}</span>}
              </div>

              <div className="input-box file-input">
                <label htmlFor="image">Imagen del producto:</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  ref={(e) => {
                    register('image').ref(e);
                    imageInputRef.current = e;
                  }}
                />
                <p className="file-hint">Deje vacío para mantener la imagen actual</p>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => navigate('/edit-product')}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
              </div>
            </form>
          </div>

          {imagePreview && (
            <div className="image-preview-container">
              <h3>Vista previa de la imagen</h3>
              <div className="image-preview">
                <img src={imagePreview} alt="Vista previa del producto" />
                <button 
                  type="button" 
                  className="remove-image-button"
                  onClick={handleRemoveImage}
                >
                  Eliminar imagen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;