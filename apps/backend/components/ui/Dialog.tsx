
import React, { ReactNode, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-lg p-6 mx-4 bg-card rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("text-center sm:text-left", className)}>
        {children}
    </div>
);

export const DialogTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn("text-xl font-semibold text-foreground", className)}>{children}</h2>
);

export const DialogDescription: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <p className={cn("mt-2 text-sm text-muted-foreground", className)}>{children}</p>
);

export const DialogContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("mt-4", className)}>{children}</div>
);

export const DialogFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("mt-6 flex justify-end space-x-2", className)}>{children}</div>
);


export { Dialog };
