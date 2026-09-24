import { Pencil, Trash2, Check, Repeat } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatDate, daysUntil, isOverdue } from '../../utils/dateUtils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function BillCard({ bill, onEdit, onDelete }) {
  const { money, markBillPaid } = useFinance();
  const overdue = !bill.paid && isOverdue(bill.dueDate);
  const days = daysUntil(bill.dueDate);

  let statusBadge = <Badge variant="neutral">Paid</Badge>;
  if (!bill.paid) {
    if (overdue) statusBadge = <Badge variant="danger">Overdue</Badge>;
    else if (days <= 3) statusBadge = <Badge variant="warning">Due soon</Badge>;
    else statusBadge = <Badge variant="primary">Upcoming</Badge>;
  }

  return (
    <div className="list-row" style={{ alignItems: 'flex-start', padding: '14px 0' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{bill.name}</span>
          {bill.recurring && <Repeat style={{ width: 12, height: 12, color: 'var(--color-text-faint)' }} aria-label="Recurring" />}
        </div>
        <div className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 2 }}>
          {money(bill.amount)} &middot; Due {formatDate(bill.dueDate)} &middot; {bill.category}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {statusBadge}
        {!bill.paid && (
          <Button variant="secondary" size="sm" icon={Check} onClick={() => markBillPaid(bill.id)}>
            Paid
          </Button>
        )}
        <button type="button" className="table-row-btn" aria-label={`Edit ${bill.name}`} onClick={() => onEdit(bill)}>
          <Pencil style={{ width: 15, height: 15 }} />
        </button>
        <button type="button" className="table-row-btn" aria-label={`Delete ${bill.name}`} onClick={() => onDelete(bill)}>
          <Trash2 style={{ width: 15, height: 15 }} />
        </button>
      </div>
    </div>
  );
}
