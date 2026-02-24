'use client';

import React from 'react';
import Button from './Button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function Dialog({
  open,
  onOpenChange,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}: DialogProps) {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
      onCancel?.();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="text-xl font-bold text-black">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6">{children}</div>

        {/* Footer - Actions */}
        <div className="px-6 py-4 border-t border-black/10 flex gap-3 justify-end">
          {cancelText && (
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="md"
              disabled={isLoading}
              className="text-black"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="md"
            disabled={isLoading}
            className="shadow-lg"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
