import { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input(
  { label, error, hint, prefix, className = '', wrapperClassName = '', ...rest },
  ref
) {
  const generatedId = useId();
  const id = rest.id || generatedId;

  return (
    <div className={`field ${wrapperClassName}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {prefix ? (
        <div className="input-affix">
          <span className="prefix">{prefix}</span>
          <input
            ref={ref}
            id={id}
            className={`input ${error ? 'has-error' : ''} ${className}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            {...rest}
          />
        </div>
      ) : (
        <input
          ref={ref}
          id={id}
          className={`input ${error ? 'has-error' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
      )}
      {error ? (
        <span className="field-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', ...rest },
  ref
) {
  const generatedId = useId();
  const id = rest.id || generatedId;

  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={`textarea ${error ? 'has-error' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
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
