import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { useFinance } from '../context/FinanceContext';
import { useDebounce } from '../hooks/useDebounce';

const DEFAULT_FILTERS = { search: '', type: 'all', category: 'all', account: 'all' };

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 250);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.account !== 'all' && t.account !== filters.account) return false;
      if (q && !(t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [transactions, filters, debouncedSearch]);

  function openAdd() {
    setEditingTxn(null);
    setModalOpen(true);
  }

  function openEdit(txn) {
    setEditingTxn(txn);
    setModalOpen(true);
  }

  return (
    <PageContainer
      title="Transactions"
      subtitle={`${transactions.length} total \u00b7 ${filtered.length} shown`}
      actions={
        <Button icon={Plus} onClick={openAdd}>
          Add transaction
        </Button>
      }
    >
      <TransactionFilters filters={filters} onChange={setFilters} />
      <TransactionTable transactions={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} transaction={editingTxn} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this transaction?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed.` : ''}
        confirmLabel="Delete transaction"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteTransaction(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </PageContainer>
  );
}
