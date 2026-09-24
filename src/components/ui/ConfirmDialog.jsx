import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event) {
      if (event.key === 'Escape') onCancel?.();
    }
    document.addEventListener('keydown', handleKey);
    buttonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className="modal" role="alertdialog" aria-modal="true" aria-label={title} style={{ maxWidth: 400 }}>
        <div className="modal-body" style={{ paddingTop: 28 }}>
          <div
            className="confirm-icon"
            style={{
              background: variant === 'danger' ? 'var(--color-danger-soft)' : 'var(--color-warning-soft)',
              color: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-warning)',
            }}
          >
            <AlertTriangle />
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 8 }}>{title}</h2>
          {description && <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{description}</p>}
        </div>
        <div className="form-actions" style={{ margin: '0 24px 24px' }}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} ref={buttonRef}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
