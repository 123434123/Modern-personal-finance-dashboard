import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  CalendarDays,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function MobileSidebar({ open, onClose }) {
  const { financialHealth } = useFinance();

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="mobile-sidebar-overlay" onClick={onClose} />
      <aside className="mobile-sidebar" aria-label="Navigation">
        <div className="sidebar-brand" style={{ justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <div className="sidebar-brand-mark">F</div>
            <span className="sidebar-brand-name">Finora</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">
            <X />
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="sidebar-health">
            <span className="sidebar-health-label">Financial health</span>
            <span className="sidebar-health-value">{financialHealth.label}</span>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}
