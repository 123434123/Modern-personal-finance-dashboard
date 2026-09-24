import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryMeta, categorySoftVar, categoryColorVar } from '../../utils/categoryMeta';
import { formatShortDate } from '../../utils/dateUtils';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export function RecentTransactions() {
  const { transactions, money } = useFinance();
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">Recent transactions</div>
          <div className="card-subtitle">Your latest activity</div>
        </div>
        <Link to="/transactions">
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" description="Add your first transaction to get started." />
      ) : (
        recent.map((t) => {
          const meta = getCategoryMeta(t.category);
          const Icon = meta.icon;
          return (
            <div className="list-row" key={t.id}>
              <div className="tx-icon" style={{ background: categorySoftVar(t.category), color: categoryColorVar(t.category) }}>
                <Icon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title}
                </div>
                <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {t.category} &middot; {formatShortDate(t.date)}
                </div>
              </div>
              <span className={`tx-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '−'}
                {money(t.amount)}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
