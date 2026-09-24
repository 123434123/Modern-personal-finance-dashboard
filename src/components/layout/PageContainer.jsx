export function PageContainer({ title, subtitle, actions, children }) {
  return (
    <div className="page-container">
      {(title || actions) && (
        <div className="page-head">
          <div>
            {title && <h1>{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
