import { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useFinance } from '../../context/FinanceContext';

export function DataSection() {
  const { resetDemoData, clearAllData } = useFinance();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Data</div>
          <div className="card-subtitle">Finora stores everything locally in this browser</div>
        </div>
      </div>

      <div className="list-row">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Reset demo data</div>
          <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            Replace everything with the original sample transactions, budgets, goals, and bills.
          </div>
        </div>
        <Button variant="secondary" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
          Reset
        </Button>
      </div>

      <div className="list-row">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Clear application data</div>
          <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            Permanently remove all transactions, budgets, goals, and bills.
          </div>
        </div>
        <Button variant="danger" icon={Trash2} onClick={() => setConfirmClear(true)}>
          Clear data
        </Button>
      </div>

      <p className="text-faint" style={{ fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
        Finora is a frontend-only portfolio project. All data lives in this browser&rsquo;s local storage —
        there is no server, account system, or real banking connection.
      </p>

      <ConfirmDialog
        open={confirmReset}
        title="Reset to demo data?"
        description="This replaces your current transactions, budgets, goals, and bills with the original sample data. This can't be undone."
        confirmLabel="Reset data"
        variant="warning"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          setConfirmReset(false);
        }}
      />

      <ConfirmDialog
        open={confirmClear}
        title="Clear all application data?"
        description="This permanently deletes every transaction, budget, goal, and bill. This can't be undone."
        confirmLabel="Clear everything"
        variant="danger"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearAllData();
          setConfirmClear(false);
        }}
      />
    </div>
  );
}
