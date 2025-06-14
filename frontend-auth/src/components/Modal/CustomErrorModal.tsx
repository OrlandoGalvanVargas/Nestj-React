import React from 'react';
import './CustomErrorModal.css';

interface Props {
  message: string;
  onClose: () => void;
  title?: string;
}

const CustomErrorModal: React.FC<Props> = ({ message, onClose, title = 'Error' }) => {
  return (
    <div className="custom-error-modal-overlay">
      <div className="custom-error-modal">
        <div className="error-modal-content">
          <div className="error-modal-icon-container">
            <svg className="error-modal-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
            </svg>
          </div>
          <div className="error-modal-text">
            <h3 className="error-modal-title">{title}</h3>
            <p className="error-modal-message">{message}</p>
          </div>
          <button className="error-modal-close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
          <div className="error-modal-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomErrorModal;