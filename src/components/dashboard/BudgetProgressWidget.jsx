import { Link } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { calculateBudgetUsage } from '../../utils/calculations';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

const STATUS_CLASS = { healthy: 'accent', warning: 'warning', over: 'danger' };

export function BudgetProgressWidget() {
  const { budgets, transactions, money } = useFinance();

  const ranked = budgets
    .map((b) => ({ budget: b, usage: calculateBudgetUsage(b, transactions) }))
    .sort((a, b) => b.usage.percent - a.usage.percent)
    .slice(0, 4);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">Budget progress</div>
          <div className="card-subtitle">This month, by category</div>
        </div>
        <Link to="/budgets">
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </div>

      {ranked.length === 0 ? (
        <EmptyState icon={PiggyBank} title="No budgets yet" description="Create a budget to track spending by category." />
      ) : (
        ranked.map(({ budget, usage }) => (
          <div key={budget.id} style={{ marginBottom: 18 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{budget.category}</span>
              <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                {money(usage.spent)} of {money(budget.amount)}
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${STATUS_CLASS[usage.status]}`}
                style={{ width: `${Math.min(100, usage.percent)}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
