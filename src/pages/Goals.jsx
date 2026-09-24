import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalModal } from '../components/goals/GoalModal';
import { AddFundsModal } from '../components/goals/AddFundsModal';
import { useFinance } from '../context/FinanceContext';

export default function Goals() {
  const { goals, deleteGoal } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fundsTarget, setFundsTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <PageContainer
      title="Savings goals"
      subtitle="Set targets and track your progress toward what matters."
      actions={
        <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>
          Create goal
        </Button>
      }
    >
      {goals.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Target}
            title="No savings goals yet"
            description="Create a goal to start tracking progress toward something you're saving for."
            action={
              <Button icon={Plus} onClick={() => setModalOpen(true)}>
                Create goal
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-3">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={(goal) => { setEditing(goal); setModalOpen(true); }}
              onDelete={setDeleteTarget}
              onAddFunds={setFundsTarget}
            />
          ))}
        </div>
      )}

      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} goal={editing} />
      <AddFundsModal open={Boolean(fundsTarget)} onClose={() => setFundsTarget(null)} goal={fundsTarget} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this goal?"
        description={deleteTarget ? `"${deleteTarget.name}" and its saved progress will be permanently removed.` : ''}
        confirmLabel="Delete goal"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null); }}
      />
    </PageContainer>
  );
}
