import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size,
    icon: Icon,
    iconOnly = false,
    loading = false,
    fullWidth = false,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant] || VARIANT_CLASS.primary,
    size === 'sm' ? 'btn-sm' : '',
    iconOnly ? 'btn-icon-only' : '',
    fullWidth ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} type={type} className={classes} disabled={loading || rest.disabled} {...rest}>
      {loading ? <Loader2 style={{ animation: 'spin 0.7s linear infinite' }} /> : Icon ? <Icon /> : null}
      {!iconOnly && children}
    </button>
  );
});
