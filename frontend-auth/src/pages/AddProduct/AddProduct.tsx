import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createProduct } from '../../api/product';
import Navbar from '../../components/Navbar/Navbar';
import './AddProduct.css';
import CustomSuccessModal from '../../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../../components/Modal/CustomErrorModal';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  categoryName: string;
  image?: FileList;
}

const categories = ['Electrónica','Ropa','Hogar','Juguetes','Deportes','Belleza','Alimentos','Libros','Mascotas','Oficina'];

const AddProduct: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProductFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('description', data.description);
      formData.append('categoryName', data.categoryName);
      
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      await createProduct(formData);

      setSuccessMessage('¡Producto agregado correctamente!');
      
      // Limpiar el formulario después de 1 segundo (para que el usuario vea el mensaje de éxito)
      setTimeout(() => {
        reset(); // Esto limpia todos los campos del formulario
        setImagePreview(null); // Limpiar la previsualización de la imagen
        setSuccessMessage(''); // Limpiar el mensaje de éxito
        if (imageInputRef.current) {
          imageInputRef.current.value = ''; // Limpiar el input de archivo
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('Error al agregar producto:', error);
      const message = error.response?.data?.message || 'Error al agregar el producto, por favor intente más tarde';
      setErrorMessage(message);

// Cerrar el modal automáticamente después de 2 segundos
setTimeout(() => {
  setErrorMessage('');
}, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-product-page-container">
      {/* Botón de regresar ahora está fuera del form-wrapper */}
      <button className="back-button" onClick={() => navigate('/edit-product')}>
        ← Regresar
      </button>
      
      <div className="product-form-container">
        <div className="form-wrapper">
          <h2>Agregar Nuevo Producto</h2>
          
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
  {...register('image', { required: 'Debe seleccionar una imagen' })}
  ref={(e) => {
    register('image').ref(e);
    imageInputRef.current = e;
  }}
/>
{errors.image && <span className="error-text">{errors.image.message}</span>}

              <p className="file-hint">Formatos aceptados: JPG, PNG, GIF</p>
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
                {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
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
                onClick={() => {
                  setImagePreview(null);
                  if (imageInputRef.current) {
                    imageInputRef.current.value = '';
                  }
                }}
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

export default AddProduct;