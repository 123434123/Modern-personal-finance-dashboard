import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2, Receipt } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryMeta, categorySoftVar, categoryColorVar } from '../../utils/categoryMeta';
import { formatDate } from '../../utils/dateUtils';
import { EmptyState } from '../ui/EmptyState';
import { Badge } from '../ui/Badge';

const PAGE_SIZE = 8;

function SortIcon({ active, dir }) {
  if (!active) return <ArrowUpDown style={{ width: 12, height: 12, opacity: 0.5 }} />;
  return dir === 'asc' ? <ArrowUp style={{ width: 12, height: 12 }} /> : <ArrowDown style={{ width: 12, height: 12 }} />;
}

export function TransactionTable({ transactions, onEdit, onDelete }) {
  const { money } = useFinance();
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [transactions.length, sort]);

  function toggleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
  }

  const sorted = useMemo(() => {
    const copy = [...transactions];
    copy.sort((a, b) => {
      let result = 0;
      if (sort.key === 'date') result = new Date(a.date) - new Date(b.date);
      else if (sort.key === 'amount') result = a.amount - b.amount;
      else if (sort.key === 'title') result = a.title.localeCompare(b.title);
      return sort.dir === 'asc' ? result : -result;
    });
    return copy;
  }, [transactions, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (transactions.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description="Try adjusting your filters, or add a new transaction to get started."
        />
      </div>
    );
  }

  return (
    <div className="card card-tight">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('title')}>
                <span className="flex items-center gap-1">
                  Transaction <SortIcon active={sort.key === 'title'} dir={sort.dir} />
                </span>
              </th>
              <th>Category</th>
              <th className="col-hide-mobile">Account</th>
              <th className="sortable col-hide-mobile" onClick={() => toggleSort('date')}>
                <span className="flex items-center gap-1">
                  Date <SortIcon active={sort.key === 'date'} dir={sort.dir} />
                </span>
              </th>
              <th className="sortable" onClick={() => toggleSort('amount')} style={{ textAlign: 'right' }}>
                <span className="flex items-center gap-1" style={{ justifyContent: 'flex-end' }}>
                  Amount <SortIcon active={sort.key === 'amount'} dir={sort.dir} />
                </span>
              </th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => {
              const meta = getCategoryMeta(t.category);
              const Icon = meta.icon;
              return (
                <tr key={t.id}>
                  <td>
                    <div className="tx-title-cell">
                      <div className="tx-icon" style={{ background: categorySoftVar(t.category), color: categoryColorVar(t.category) }}>
                        <Icon />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.title}
                        </div>
                        {t.notes && (
                          <div className="text-faint" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                            {t.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="neutral">{t.category}</Badge>
                  </td>
                  <td className="col-hide-mobile text-muted">{t.account}</td>
                  <td className="col-hide-mobile text-muted">{formatDate(t.date)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`tx-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '−'}
                      {money(t.amount)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ justifyContent: 'flex-end' }}>
                      <button type="button" className="table-row-btn" aria-label={`Edit ${t.title}`} onClick={() => onEdit(t)}>
                        <Pencil style={{ width: 15, height: 15 }} />
                      </button>
                      <button type="button" className="table-row-btn" aria-label={`Delete ${t.title}`} onClick={() => onDelete(t)}>
                        <Trash2 style={{ width: 15, height: 15 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4" style={{ paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            Page {page} of {totalPages} &middot; {sorted.length} transactions
          </span>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
