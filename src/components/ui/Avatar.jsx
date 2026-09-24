import { initials } from '../../utils/formatters';

export function Avatar({ name = '', size = 38, className = '' }) {
  return (
    <div
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials(name) || '?'}
    </div>
  );
}
