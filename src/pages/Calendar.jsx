import { useMemo, useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { DayDetails } from '../components/calendar/DayDetails';
import { BillCard } from '../components/bills/BillCard';
import { BillModal } from '../components/bills/BillModal';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { useFinance } from '../context/FinanceContext';
import { toISODate, addMonths, subMonths } from '../utils/dateUtils';

export default function CalendarPage() {
  const { transactions, bills, goals, budgets, deleteBill } = useFinance();
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [txnModalOpen, setTxnModalOpen] = useState(false);
  const [txnDefaultDate, setTxnDefaultDate] = useState(null);
  const [billDefaultDate, setBillDefaultDate] = useState(null);

  const eventsByDate = useMemo(() => {
    const map = new Map();
    const ensure = (key) => {
      if (!map.has(key)) map.set(key, { transactions: [], bills: [], goalDeadlines: [] });
      return map.get(key);
    };
    transactions.forEach((t) => ensure(t.date).transactions.push(t));
    bills.forEach((b) => ensure(b.dueDate).bills.push(b));
    goals.forEach((g) => {
      if (g.deadline) ensure(g.deadline).goalDeadlines.push(g);
    });
    return map;
  }, [transactions, bills, goals]);

  const selectedEvents = selectedDate ? eventsByDate.get(toISODate(selectedDate)) : null;

  const sortedBills = [...bills].sort((a, b) => {
    if (a.paid !== b.paid) return a.paid ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <PageContainer
      title="Calendar"
      subtitle="Every bill, transaction, and deadline in one place."
      actions={
        <Button
          icon={Plus}
          onClick={() => {
            setEditingBill(null);
            setBillDefaultDate(toISODate());
            setBillModalOpen(true);
          }}
        >
          Add bill
        </Button>
      }
    >
      <div className="grid grid-2col" style={{ marginBottom: 20, alignItems: 'start' }}>
        <CalendarGrid
          monthDate={monthDate}
          onPrevMonth={() => setMonthDate((d) => subMonths(d, 1))}
          onNextMonth={() => setMonthDate((d) => addMonths(d, 1))}
          onToday={() => {
            setMonthDate(new Date());
            setSelectedDate(new Date());
          }}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          eventsByDate={eventsByDate}
          hasBudgets={budgets.length > 0}
        />
        <DayDetails
          date={selectedDate}
          events={selectedEvents}
          hasBudgets={budgets.length > 0}
          onAddTransaction={(date) => {
            setTxnDefaultDate(toISODate(date));
            setTxnModalOpen(true);
          }}
          onAddBill={(date) => {
            setEditingBill(null);
            setBillDefaultDate(toISODate(date));
            setBillModalOpen(true);
          }}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All bills</div>
            <div className="card-subtitle">{bills.length} tracked</div>
          </div>
        </div>
        {sortedBills.length === 0 ? (
          <EmptyState icon={Receipt} title="No bills yet" description="Add a bill to start tracking due dates." />
        ) : (
          sortedBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onEdit={(b) => {
                setEditingBill(b);
                setBillDefaultDate(null);
                setBillModalOpen(true);
              }}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      <BillModal
        open={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        bill={editingBill}
        defaultDate={billDefaultDate}
      />
      <TransactionModal
        open={txnModalOpen}
        onClose={() => setTxnModalOpen(false)}
        defaultDate={txnDefaultDate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this bill?"
        description={deleteTarget ? `"${deleteTarget.name}" will no longer appear on your calendar or dashboard.` : ''}
        confirmLabel="Delete bill"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteBill(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </PageContainer>
  );
}
