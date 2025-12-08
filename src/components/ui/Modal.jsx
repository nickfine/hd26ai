/**
 * Modal Component
 * A dialog/modal component with backdrop, close button, and animation.
 * 
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Action">
 *   <p>Are you sure?</p>
 *   <Modal.Footer>
 *     <Button onClick={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="danger">Delete</Button>
 *   </Modal.Footer>
 * </Modal>
 */

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/design-system';
import { IconButton } from './Button';

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {() => void} onClose - Callback when modal should close
 * @property {string} [title] - Modal title
 * @property {string} [description] - Modal description/subtitle
 * @property {'sm' | 'md' | 'lg' | 'xl' | 'full'} [size='md']
 * @property {boolean} [closeOnBackdrop=true] - Close when clicking backdrop
 * @property {boolean} [closeOnEscape=true] - Close when pressing Escape
 * @property {boolean} [showCloseButton=true] - Show X button in header
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
};

function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  children,
  ...props
}) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);

  // Focus management and scroll lock
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocus.current = document.activeElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus modal
      modalRef.current?.focus();
      
      // Add event listener
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove event listener
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      style={{ zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white border-2 border-neutral-900 shadow-xl',
          'animate-slide-up',
          SIZE_MAP[size],
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-neutral-200">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-bold text-neutral-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-neutral-500"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <IconButton
                icon={<X />}
                label="Close modal"
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="-mr-2 -mt-1"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );

  // Render to portal
  return createPortal(modalContent, document.body);
}

/**
 * Modal.Footer - Footer section with action buttons
 */
Modal.Footer = function ModalFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 pt-4 mt-4 border-t border-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Footer.displayName = 'Modal.Footer';

/**
 * ConfirmModal - Pre-built confirmation dialog
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const Button = require('./Button').default;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      {message && (
        <p className="text-sm text-neutral-600">{message}</p>
      )}
      
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmModal.displayName = 'ConfirmModal';

export default Modal;


