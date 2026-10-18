import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="clay-toast-container" id="toastContainer" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className="clay-toast">
          <span className="toast-icon">{toast.icon}</span>
          <span className="toast-text">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
