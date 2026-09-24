import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeftRight, PiggyBank, Target, Receipt } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/dateUtils';

export function GlobalSearch({ open, onClose }) {
  const { transactions, budgets, goals, bills, money } = useFinance();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return null;

    const txns = transactions
      .filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .slice(0, 5);
    const buds = budgets.filter((b) => b.category.toLowerCase().includes(q)).slice(0, 5);
    const gls = goals.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 5);
    const blls = bills.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 5);

    return { txns, buds, gls, blls, total: txns.length + buds.length + gls.length + blls.length };
  }, [debouncedQuery, transactions, budgets, goals, bills]);

  if (!open) return null;

  function go(path) {
    navigate(path);
    onClose();
  }

  return createPortal(
    <div
      className="search-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Global search">
        <div className="search-input-row">
          <Search />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, budgets, goals, bills&hellip;"
            aria-label="Search Finora"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
        </div>

        <div className="search-results">
          {!results && (
            <div style={{ padding: '32px 16px', textAlign: 'center' }} className="text-muted">
              Start typing to search across your data.
            </div>
          )}

          {results && results.total === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center' }} className="text-muted">
              No results for &ldquo;{debouncedQuery}&rdquo;.
            </div>
          )}

          {results && results.txns.length > 0 && (
            <>
              <div className="search-group-label">Transactions</div>
              {results.txns.map((t) => (
                <button key={t.id} className="search-result-item" onClick={() => go('/transactions')}>
                  <ArrowLeftRight style={{ width: 16, height: 16, color: 'var(--color-text-faint)' }} />
                  <div className="search-result-main">
                    <div className="search-result-title">{t.title}</div>
                    <div className="search-result-meta">
                      {t.category} &middot; {formatDate(t.date)}
                    </div>
                  </div>
                  <span className={t.type === 'income' ? 'text-success' : ''}>{money(t.amount)}</span>
                </button>
              ))}
            </>
          )}

          {results && results.buds.length > 0 && (
            <>
              <div className="search-group-label">Budgets</div>
              {results.buds.map((b) => (
                <button key={b.id} className="search-result-item" onClick={() => go('/budgets')}>
                  <PiggyBank style={{ width: 16, height: 16, color: 'var(--color-text-faint)' }} />
                  <div className="search-result-main">
                    <div className="search-result-title">{b.category}</div>
                    <div className="search-result-meta">Budget of {money(b.amount)}</div>
                  </div>
                </button>
              ))}
            </>
          )}

          {results && results.gls.length > 0 && (
            <>
              <div className="search-group-label">Goals</div>
              {results.gls.map((g) => (
                <button key={g.id} className="search-result-item" onClick={() => go('/goals')}>
                  <Target style={{ width: 16, height: 16, color: 'var(--color-text-faint)' }} />
                  <div className="search-result-main">
                    <div className="search-result-title">{g.name}</div>
                    <div className="search-result-meta">Target {money(g.targetAmount)}</div>
                  </div>
                </button>
              ))}
            </>
          )}

          {results && results.blls.length > 0 && (
            <>
              <div className="search-group-label">Bills</div>
              {results.blls.map((b) => (
                <button key={b.id} className="search-result-item" onClick={() => go('/calendar')}>
                  <Receipt style={{ width: 16, height: 16, color: 'var(--color-text-faint)' }} />
                  <div className="search-result-main">
                    <div className="search-result-title">{b.name}</div>
                    <div className="search-result-meta">Due {formatDate(b.dueDate)}</div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
