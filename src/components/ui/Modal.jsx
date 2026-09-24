import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, footer, maxWidth }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Move focus into the modal for keyboard/screen-reader users.
    const focusable = modalRef.current?.querySelector(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={modalRef}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
            <X />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="form-actions" style={{ margin: '0 24px 24px' }}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
