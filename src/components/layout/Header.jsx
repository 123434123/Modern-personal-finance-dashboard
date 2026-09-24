import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun, ChevronDown, User, Settings as SettingsIcon, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem, DropdownDivider, DropdownLabel } from '../ui/Dropdown';
import { GlobalSearch } from '../search/GlobalSearch';
import { formatDate } from '../../utils/dateUtils';

const NOTIF_ICON = {
  danger: { Icon: AlertTriangle, bg: 'var(--color-danger-soft)', color: 'var(--color-danger)' },
  warning: { Icon: AlertTriangle, bg: 'var(--color-warning-soft)', color: 'var(--color-warning)' },
  success: { Icon: CheckCircle2, bg: 'var(--color-success-soft)', color: 'var(--color-success)' },
};

export function Header({ onMenuClick }) {
  const { theme, toggleTheme, notifications, settings, resetDemoData } = useFinance();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleKey(event) {
      const isCombo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCombo) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const profile = settings?.profile || {};

  return (
    <header className="app-header">
      <button type="button" className="icon-btn header-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu />
      </button>

      <button type="button" className="header-search" onClick={() => setSearchOpen(true)}>
        <Search />
        <span>Search transactions, budgets, goals&hellip;</span>
        <kbd>&#8984;K</kbd>
      </button>

      <div className="header-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>

        <Dropdown
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          trigger={
            <button
              type="button"
              className="icon-btn"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={`Notifications${notifications.length ? ` (${notifications.length} new)` : ''}`}
            >
              <Bell />
              {notifications.length > 0 && <span className="dot" />}
            </button>
          }
        >
          <div className="panel-wide">
            <div className="panel-head">
              <span className="panel-head-title">Notifications</span>
              <span className="badge badge-neutral">{notifications.length}</span>
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }} className="text-muted">
                You&rsquo;re all caught up.
              </div>
            ) : (
              notifications.map((n) => {
                const tone = NOTIF_ICON[n.tone] || NOTIF_ICON.warning;
                const { Icon } = tone;
                return (
                  <div className="notif-item" key={n.id}>
                    <div className="notif-icon" style={{ background: tone.bg, color: tone.color }}>
                      <Icon />
                    </div>
                    <div>
                      <div className="notif-text">
                        <strong>{n.title}.</strong> {n.message}
                      </div>
                      <div className="notif-time">{formatDate(n.date)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Dropdown>

        <Dropdown
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          trigger={
            <button
              type="button"
              className="icon-btn"
              style={{ width: 'auto', gap: 8, padding: '4px 8px 4px 4px' }}
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Account menu"
            >
              <Avatar name={profile.name} size={30} />
              <ChevronDown style={{ width: 14, height: 14 }} />
            </button>
          }
        >
          <DropdownLabel>{profile.name || 'My account'}</DropdownLabel>
          <DropdownItem
            icon={User}
            onClick={() => {
              setProfileOpen(false);
              navigate('/settings');
            }}
          >
            View profile
          </DropdownItem>
          <DropdownItem
            icon={SettingsIcon}
            onClick={() => {
              setProfileOpen(false);
              navigate('/settings');
            }}
          >
            Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            icon={RotateCcw}
            onClick={() => {
              setProfileOpen(false);
              resetDemoData();
            }}
          >
            Reset demo data
          </DropdownItem>
        </Dropdown>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
