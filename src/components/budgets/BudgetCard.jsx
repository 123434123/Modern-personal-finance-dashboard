import { Pencil, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { calculateBudgetUsage } from '../../utils/calculations';
import { getCategoryMeta, categorySoftVar, categoryColorVar } from '../../utils/categoryMeta';
import { Badge } from '../ui/Badge';

const STATUS_META = {
  healthy: { label: 'Healthy', variant: 'success', fill: 'accent' },
  warning: { label: 'Warning', variant: 'warning', fill: 'warning' },
  over: { label: 'Over budget', variant: 'danger', fill: 'danger' },
};

export function BudgetCard({ budget, onEdit, onDelete }) {
  const { transactions, money } = useFinance();
  const usage = calculateBudgetUsage(budget, transactions);
  const meta = getCategoryMeta(budget.category);
  const Icon = meta.icon;
  const status = STATUS_META[usage.status];

  return (
    <div className="card">
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-3">
          <div className="tx-icon" style={{ background: categorySoftVar(budget.category), color: categoryColorVar(budget.category) }}>
            <Icon />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{budget.category}</div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
        <div className="flex gap-1">
          <button type="button" className="table-row-btn" aria-label={`Edit ${budget.category} budget`} onClick={() => onEdit(budget)}>
            <Pencil style={{ width: 15, height: 15 }} />
          </button>
          <button type="button" className="table-row-btn" aria-label={`Delete ${budget.category} budget`} onClick={() => onDelete(budget)}>
            <Trash2 style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      <div className="progress-track" style={{ marginBottom: 12 }}>
        <div className={`progress-fill ${status.fill}`} style={{ width: `${Math.min(100, usage.percent)}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-faint" style={{ fontSize: 11 }}>Spent</div>
          <div style={{ fontWeight: 600 }}>{money(usage.spent)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="text-faint" style={{ fontSize: 11 }}>Budget</div>
          <div style={{ fontWeight: 600 }}>{money(budget.amount)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="text-faint" style={{ fontSize: 11 }}>{usage.remaining >= 0 ? 'Remaining' : 'Over by'}</div>
          <div style={{ fontWeight: 600, color: usage.remaining < 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
            {money(Math.abs(usage.remaining))}
          </div>
        </div>
      </div>
    </div>
  );
}
