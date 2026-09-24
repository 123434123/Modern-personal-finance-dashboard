import { Search, X } from 'lucide-react';
import { ALL_CATEGORIES, ACCOUNTS } from '../../data/seedData';

const TYPE_CHIPS = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export function TransactionFilters({ filters, onChange }) {
  const hasActiveFilters =
    filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.account !== 'all';

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card card-tight" style={{ marginBottom: 20 }}>
      <div className="toolbar">
        <div className="input-affix" style={{ minWidth: 240, flex: 1 }}>
          <span className="prefix">
            <Search style={{ width: 15, height: 15 }} />
          </span>
          <input
            className="input"
            style={{ paddingLeft: 34 }}
            placeholder="Search transactions&hellip;"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            aria-label="Search transactions"
          />
        </div>

        <div className="flex gap-2">
          {TYPE_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              className={`chip ${filters.type === chip.value ? 'active' : ''}`}
              onClick={() => set('type', chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>

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

        <select
          className="select"
          style={{ maxWidth: 150 }}
          value={filters.account}
          onChange={(e) => set('account', e.target.value)}
          aria-label="Filter by account"
        >
          <option value="all">All accounts</option>
          {ACCOUNTS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onChange({ search: '', type: 'all', category: 'all', account: 'all' })}
          >
            <X style={{ width: 14, height: 14 }} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
