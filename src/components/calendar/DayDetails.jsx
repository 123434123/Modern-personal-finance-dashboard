import { Plus, CalendarDays } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryMeta, categorySoftVar, categoryColorVar } from '../../utils/categoryMeta';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function DayDetails({ date, events, onAddTransaction, onAddBill, hasBudgets }) {
  const { money } = useFinance();
  const budgetReset = Boolean(hasBudgets) && date?.getDate() === 1;

  if (!date) {
    return (
      <div className="card" style={{ height: '100%' }}>
        <EmptyState icon={CalendarDays} title="Select a date" description="Click any day to see what's happening on your calendar." />
      </div>
    );
  }

  const hasEvents =
    (events?.transactions?.length || 0) > 0 ||
    (events?.bills?.length || 0) > 0 ||
    (events?.goalDeadlines?.length || 0) > 0 ||
    budgetReset;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">{formatDate(date, 'EEEE, MMMM d')}</div>
          <div className="card-subtitle">{hasEvents ? 'Scheduled activity' : 'Nothing scheduled'}</div>
        </div>
      </div>

      <div className="flex gap-2" style={{ marginBottom: 18 }}>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => onAddTransaction(date)}>
          Transaction
        </Button>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => onAddBill(date)}>
          Bill
        </Button>
      </div>

      {budgetReset && (
        <div className="notif-item" style={{ padding: '10px 0' }}>
          <div className="notif-icon" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
            <CalendarDays style={{ width: 15, height: 15 }} />
          </div>
          <div className="notif-text">Monthly budgets reset today.</div>
        </div>
      )}

      {events?.bills?.map((b) => (
        <div className="list-row" key={b.id}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{b.name}</div>
            <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Bill due &middot; {b.category}</div>
          </div>
          <span style={{ fontWeight: 600 }}>{money(b.amount)}</span>
        </div>
      ))}

      {events?.goalDeadlines?.map((g) => (
        <div className="list-row" key={g.id}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{g.name}</div>
            <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Goal deadline</div>
          </div>
          <span style={{ fontWeight: 600 }}>{money(g.targetAmount)}</span>
        </div>
      ))}

      {events?.transactions?.map((t) => {
        const meta = getCategoryMeta(t.category);
        const Icon = meta.icon;
        return (
          <div className="list-row" key={t.id}>
            <div className="tx-icon" style={{ background: categorySoftVar(t.category), color: categoryColorVar(t.category), width: 30, height: 30 }}>
              <Icon style={{ width: 14, height: 14 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{t.title}</div>
              <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{t.category}</div>
            </div>
            <span className={`tx-amount ${t.type}`}>
              {t.type === 'income' ? '+' : '−'}
              {money(t.amount)}
            </span>
          </div>
        );
      })}

      {!hasEvents && (
        <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
          No transactions, bills, or deadlines fall on this day.
        </p>
      )}
    </div>
  );
}
