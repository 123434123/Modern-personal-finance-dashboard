import { Link } from 'react-router-dom';
import { Receipt, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getUpcomingBills, getOverdueBills } from '../../utils/calculations';
import { formatShortDate, daysUntil } from '../../utils/dateUtils';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function UpcomingBillsWidget() {
  const { bills, money, markBillPaid } = useFinance();
  const overdue = getOverdueBills(bills);
  const upcoming = getUpcomingBills(bills, 21).filter((b) => !overdue.includes(b));
  const combined = [...overdue, ...upcoming].slice(0, 5);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">Upcoming bills</div>
          <div className="card-subtitle">Due soon or overdue</div>
        </div>
        <Link to="/calendar">
          <Button variant="ghost" size="sm">
            View calendar
          </Button>
        </Link>
      </div>

      {combined.length === 0 ? (
        <EmptyState icon={Receipt} title="Nothing due soon" description="You're all caught up on bills." />
      ) : (
        combined.map((bill) => {
          const overdueBill = overdue.includes(bill);
          const days = daysUntil(bill.dueDate);
          return (
            <div className="list-row" key={bill.id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{bill.name}</div>
                <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {money(bill.amount)} &middot; {formatShortDate(bill.dueDate)}
                </div>
              </div>
              {overdueBill ? (
                <Badge variant="danger">Overdue</Badge>
              ) : (
                <Badge variant={days <= 3 ? 'warning' : 'neutral'}>
                  {days === 0 ? 'Today' : `${days}d left`}
                </Badge>
              )}
              <button
                type="button"
                className="icon-btn"
                style={{ width: 32, height: 32 }}
                aria-label={`Mark ${bill.name} as paid`}
                onClick={() => markBillPaid(bill.id)}
              >
                <Check style={{ width: 15, height: 15 }} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
