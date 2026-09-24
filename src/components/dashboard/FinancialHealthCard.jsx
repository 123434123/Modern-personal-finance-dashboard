import { useFinance } from '../../context/FinanceContext';

const TONE = {
  Excellent: 'var(--color-success)',
  Good: 'var(--color-primary)',
  'Needs Attention': 'var(--color-warning)',
  Critical: 'var(--color-danger)',
};

const BLURB = {
  Excellent: 'Your savings rate, budgets and bills are all in great shape.',
  Good: 'Things are largely on track, with a little room to tighten up.',
  'Needs Attention': 'A few budgets or bills need a closer look this month.',
  Critical: 'Spending, budgets or bills need attention soon.',
};

export function FinancialHealthCard() {
  const { financialHealth } = useFinance();
  const { score, label } = financialHealth;
  const color = TONE[label] || TONE.Good;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">Financial health</div>
          <div className="card-subtitle">Based on your current data</div>
        </div>
      </div>
      <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
        <svg width={128} height={128} viewBox="0 0 128 128" style={{ flexShrink: 0 }}>
          <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--color-surface-alt)" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 600ms ease' }}
          />
          <text x="64" y="60" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--color-text)" fontFamily="var(--font-display)">
            {score}
          </text>
          <text x="64" y="80" textAnchor="middle" fontSize="11" fill="var(--color-text-faint)">
            out of 100
          </text>
        </svg>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="badge" style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}>
            {label}
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 10 }}>
            {BLURB[label]}
          </p>
        </div>
      </div>
      <p className="text-faint" style={{ fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
        This score is an informational estimate calculated only from the data you&rsquo;ve entered in
        Finora. It is not professional financial advice.
      </p>
    </div>
  );
}
