import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  CalendarDays,
  BarChart3,
  Settings,
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

const HEALTH_TONE = {
  Excellent: 'var(--color-success)',
  Good: 'var(--color-primary)',
  'Needs Attention': 'var(--color-warning)',
  Critical: 'var(--color-danger)',
};

export function Sidebar() {
  const { financialHealth } = useFinance();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">F</div>
        <span className="sidebar-brand-name">Finora</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-health">
          <span className="sidebar-health-label">Financial health</span>
          <span className="sidebar-health-value" style={{ color: HEALTH_TONE[financialHealth.label] }}>
            {financialHealth.label}
          </span>
        </div>
      </div>
    </aside>
  );
}
