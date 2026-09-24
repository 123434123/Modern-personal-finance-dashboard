import { Pencil, Trash2, PlusCircle, CalendarClock } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { calculateGoalProgress } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const STATUS_VARIANT = {
  'On track': 'primary',
  'Goal reached': 'success',
  'Behind schedule': 'warning',
  'Deadline passed': 'danger',
};

export function GoalCard({ goal, onEdit, onDelete, onAddFunds }) {
  const { money } = useFinance();
  const progress = calculateGoalProgress(goal);

  return (
    <div className="card">
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{goal.name}</div>
          <Badge variant="neutral" className="mt-1">{goal.category}</Badge>
        </div>
        <div className="flex gap-1">
          <button type="button" className="table-row-btn" aria-label={`Edit ${goal.name}`} onClick={() => onEdit(goal)}>
            <Pencil style={{ width: 15, height: 15 }} />
          </button>
          <button type="button" className="table-row-btn" aria-label={`Delete ${goal.name}`} onClick={() => onDelete(goal)}>
            <Trash2 style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-muted" style={{ fontSize: 'var(--text-sm)', margin: '10px 0' }}>
          {goal.description}
        </p>
      )}

      <div style={{ margin: '16px 0 10px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>{progress.percent}%</span>
          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            {money(goal.currentAmount)} of {money(goal.targetAmount)}
          </span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${progress.percent >= 100 ? 'success' : 'accent'}`} style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <span className="flex items-center gap-1 text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          <CalendarClock style={{ width: 13, height: 13 }} />
          {goal.deadline ? formatDate(goal.deadline) : 'No deadline'}
        </span>
        <Badge variant={STATUS_VARIANT[progress.estimatedCompletion] || 'neutral'}>
          {progress.estimatedCompletion}
        </Badge>
      </div>

      <Button variant="secondary" size="sm" fullWidth icon={PlusCircle} onClick={() => onAddFunds(goal)}>
        Add money
      </Button>
    </div>
  );
}
