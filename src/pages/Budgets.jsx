import { useState } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { useFinance } from '../context/FinanceContext';
import { calculateBudgetUsage } from '../utils/calculations';

export default function Budgets() {
  const { budgets, transactions, deleteBudget, money } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + calculateBudgetUsage(b, transactions).spent, 0);
  const overCount = budgets.filter((b) => calculateBudgetUsage(b, transactions).status === 'over').length;

  return (
    <PageContainer
      title="Budgets"
      subtitle="Set monthly limits and track spending by category."
      actions={
        <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>
          Create budget
        </Button>
      }
    >
      {budgets.length > 0 && (
        <div className="grid grid-3" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <span className="stat-label">Total budgeted</span>
            <span className="stat-value num" style={{ fontSize: 'var(--text-xl)' }}>{money(totalBudgeted)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Spent this month</span>
            <span className="stat-value num" style={{ fontSize: 'var(--text-xl)' }}>{money(totalSpent)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Over budget</span>
            <span className="stat-value num" style={{ fontSize: 'var(--text-xl)', color: overCount > 0 ? 'var(--color-danger)' : 'inherit' }}>
              {overCount} {overCount === 1 ? 'category' : 'categories'}
            </span>
          </div>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={PiggyBank}
            title="No budgets yet"
            description="Create your first budget to start tracking spending by category."
            action={
              <Button icon={Plus} onClick={() => setModalOpen(true)}>
                Create budget
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-3">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={(bud) => { setEditing(bud); setModalOpen(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <BudgetModal open={modalOpen} onClose={() => setModalOpen(false)} budget={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this budget?"
        description={deleteTarget ? `The ${deleteTarget.category} budget will be removed. Past transactions stay untouched.` : ''}
        confirmLabel="Delete budget"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { deleteBudget(deleteTarget.id); setDeleteTarget(null); }}
      />
    </PageContainer>
  );
}
