import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement>;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, returnFocusRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLAnchorElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  // Handle closing when clicking outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Trap focus inside modal
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // If shift + tab and on first element, move to last
          if (document.activeElement === firstFocusableElementRef.current) {
            e.preventDefault();
            lastFocusableElementRef.current?.focus();
          }
        } else {
          // If tab and on last element, move to first
          if (document.activeElement === lastFocusableElementRef.current) {
            e.preventDefault();
            firstFocusableElementRef.current?.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('modal-open');
      
      // Focus first element when modal opens
      setTimeout(() => {
        firstFocusableElementRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      
      // Return focus to trigger element when modal closes
      if (!isOpen && returnFocusRef.current) {
        returnFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, returnFocusRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="login-prompt"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      ref={modalRef}
    >
      <div className="login-prompt-content">
        <h3 id="login-prompt-title">Authentication Required</h3>
        <p>You need to be logged in to test this model.</p>
        <div className="login-prompt-actions">
          <Link 
            to="/login" 
            className="login-button"
            ref={firstFocusableElementRef}
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="register-button"
          >
            Create Account
          </Link>
          <button 
            className="dismiss-button" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            ref={lastFocusableElementRef}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginPromptModal; 