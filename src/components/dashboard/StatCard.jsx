import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, delta, deltaGoodDirection = 'up', hero = false, note }) {
  let deltaClass = 'flat';
  let DeltaIcon = Minus;
  if (typeof delta === 'number' && Math.abs(delta) >= 0.5) {
    const isUp = delta > 0;
    const isGood = deltaGoodDirection === 'up' ? isUp : !isUp;
    deltaClass = isGood ? 'up' : 'down';
    DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight;
  }

  return (
    <div className={`stat-card ${hero ? 'stat-hero' : ''}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon">
            <Icon />
          </div>
        )}
      </div>
      <div className="stat-value num">{value}</div>
      {typeof delta === 'number' ? (
        <span className={`stat-delta ${deltaClass}`}>
          <DeltaIcon />
          {Math.abs(delta).toFixed(1)}% vs last month
        </span>
      ) : note ? (
        <span className="stat-delta flat">{note}</span>
      ) : null}
    </div>
  );
}
