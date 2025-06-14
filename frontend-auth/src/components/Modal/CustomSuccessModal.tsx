import React from 'react';
import './CustomSuccessModal.css';

interface Props {
  message: string;
  onClose: () => void;
  title?: string;
}

const CustomSuccessModal: React.FC<Props> = ({ message, onClose, title = 'Éxito' }) => {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-content">
          <div className="modal-icon-container">
            <svg className="modal-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
          </div>
          <div className="modal-text">
            <h3 className="modal-title">{title}</h3>
            <p className="modal-message">{message}</p>
          </div>
          <button className="modal-close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
          <div className="modal-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomSuccessModal;