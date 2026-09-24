export function Spinner({ label = 'Loading' }) {
  return (
    <div className="page-loading" role="status" aria-label={label}>
      <div className="spinner" />
    </div>
  );
}

export function Skeleton({ width = '100%', height = 16, radius, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card" aria-hidden="true">
      <Skeleton width="40%" height={14} style={{ marginBottom: 16 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} style={{ marginBottom: 10 }} />
      ))}
    </div>
  );
}
