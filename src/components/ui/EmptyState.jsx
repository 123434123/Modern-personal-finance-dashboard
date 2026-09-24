export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon />
        </div>
      )}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
