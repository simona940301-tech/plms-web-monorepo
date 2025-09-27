
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import ReactDOM from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Array<(toasts: ToastMessage[]) => void> = [];

const toastState: { toasts: ToastMessage[] } = {
  toasts: [],
};

const toast = (message: string, type: ToastType = 'info') => {
  const newToast: ToastMessage = { id: toastId++, message, type };
  toastState.toasts = [...toastState.toasts, newToast];
  emitChange();
  setTimeout(() => {
    closeToast(newToast.id);
  }, 5000);
};

const closeToast = (id: number) => {
  toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
  emitChange();
};

const subscribe = (listener: (toasts: ToastMessage[]) => void) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

const emitChange = () => {
  for (const listener of listeners) {
    listener(toastState.toasts);
  }
};

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
    const iconMap: Record<ToastType, ReactNode> = {
        success: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
        error: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
        info: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    };
    return iconMap[type];
}

const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>(toastState.toasts);
  const portalRoot = document.getElementById('toast-container');

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return () => unsubscribe();
  }, []);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="max-w-sm w-full bg-card shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden flex items-start p-4 space-x-3"
        >
          <div className="flex-shrink-0">
            <ToastIcon type={t.type} />
          </div>
          <p className="text-sm font-medium text-foreground">{t.message}</p>
          <button onClick={() => closeToast(t.id)} className="ml-auto text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      ))}
    </>,
    portalRoot
  );
};

export { Toaster, toast };
