import { useEffect, useRef } from 'react';

export function Dropdown({ open, onClose, trigger, children, align = 'right', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose?.();
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') onClose?.();
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  return (
    <div className="dropdown" ref={ref}>
      {trigger}
      {open && (
        <div className={`dropdown-menu ${align === 'left' ? 'align-left' : ''} ${className}`} role="menu">
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, danger, children, ...rest }) {
  return (
    <button type="button" role="menuitem" className={`dropdown-item ${danger ? 'danger' : ''}`} {...rest}>
      {Icon && <Icon />}
      {children}
    </button>
  );
}

export function DropdownLabel({ children }) {
  return <div className="dropdown-label">{children}</div>;
}

export function DropdownDivider() {
  return <div className="dropdown-divider" role="separator" />;
}
