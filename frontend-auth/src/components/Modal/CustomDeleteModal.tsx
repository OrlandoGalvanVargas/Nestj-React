// src/components/CustomDeleteModal.tsx
import React from 'react';
import './CustomDeleteModal.css';

interface Props {
  productName: string;
  tipe : string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CustomDeleteModal: React.FC<Props> = ({ 
  productName,
  tipe, 
  onConfirm, 
  onCancel, 
  isLoading = false 
}) => {
  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-content">
          <div className="delete-icon-container">
            <div className="delete-icon-wrapper">
              <svg className="delete-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
              </svg>
            </div>
            <div className="delete-warning-particles">
              <div className="warning-particle warning-particle-1"></div>
              <div className="warning-particle warning-particle-2"></div>
              <div className="warning-particle warning-particle-3"></div>
              <div className="warning-particle warning-particle-4"></div>
            </div>
          </div>

       <div className="delete-modal-header">
  <h2 className="delete-modal-title">¿Eliminar {tipe}?</h2>
</div>


          <div className="delete-modal-body">
            <p className="delete-modal-message">
              Esta acción no se puede deshacer. El {tipe} <strong>"{productName}"</strong> será eliminado permanentemente del sistema.
            </p>
            <div className="delete-warning-box">
              <svg className="warning-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
              <span>Esta acción es irreversible</span>
            </div>
          </div>

          <div className="delete-modal-footer">
            <button 
              className="delete-cancel-button" 
              onClick={onCancel}
              disabled={isLoading}
            >
              <svg className="button-iconDelete" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>Cancelar</span>
            </button>
            <button 
              className="delete-confirm-button" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <svg className="button-iconDelete" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                  <span>Eliminar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDeleteModal;