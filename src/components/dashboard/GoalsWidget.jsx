import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { calculateGoalProgress } from '../../utils/calculations';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export function GoalsWidget() {
  const { goals, money } = useFinance();

  const ranked = [...goals]
    .map((g) => ({ goal: g, progress: calculateGoalProgress(g) }))
    .sort((a, b) => b.progress.percent - a.progress.percent)
    .slice(0, 4);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">Savings goals</div>
          <div className="card-subtitle">Progress toward your targets</div>
        </div>
        <Link to="/goals">
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </div>

      {ranked.length === 0 ? (
        <EmptyState icon={Target} title="No goals yet" description="Create a savings goal to start tracking progress." />
      ) : (
        ranked.map(({ goal, progress }) => (
          <div key={goal.id} style={{ marginBottom: 18 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{goal.name}</span>
              <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                {money(goal.currentAmount)} of {money(goal.targetAmount)}
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${progress.percent >= 100 ? 'success' : 'accent'}`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
