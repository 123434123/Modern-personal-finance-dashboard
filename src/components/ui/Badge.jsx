const VARIANT_CLASS = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
  accent: 'badge-accent',
  primary: 'badge-primary',
};

export function Badge({ variant = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span className={`badge ${VARIANT_CLASS[variant] || VARIANT_CLASS.neutral} ${className}`}>
      {Icon && <Icon />}
      {children}
    </span>
  );
}
