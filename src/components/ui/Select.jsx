import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className = '', ...rest },
  ref
) {
  const generatedId = useId();
  const id = rest.id || generatedId;

  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="select-wrap">
        <select
          ref={ref}
          id={id}
          className={`select ${error ? 'has-error' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" />
      </div>
      {error ? (
        <span className="field-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  );
});
