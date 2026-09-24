import { ALL_CATEGORIES } from '../../data/seedData';

export const RANGE_OPTIONS = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'last-3-months', label: 'Last 3 Months' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'this-year', label: 'This Year' },
];

export function AnalyticsFilters({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card card-tight" style={{ marginBottom: 20 }}>
      <div className="toolbar">
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`chip ${filters.range === opt.value ? 'active' : ''}`}
              onClick={() => set('range', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          className="select"
          style={{ maxWidth: 170, marginLeft: 'auto' }}
          value={filters.type}
          onChange={(e) => set('type', e.target.value)}
          aria-label="Filter by transaction type"
        >
          <option value="all">All types</option>
          <option value="income">Income only</option>
          <option value="expense">Expenses only</option>
        </select>

        <select
          className="select"
          style={{ maxWidth: 170 }}
          value={filters.category}
          onChange={(e) => set('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
