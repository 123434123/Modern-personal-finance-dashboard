import { Sun, Moon, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Bright surfaces, ideal for daytime use.' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Low-glare surfaces, easier at night.' },
];

export function AppearanceSection() {
  const { theme, setTheme } = useFinance();

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Appearance</div>
          <div className="card-subtitle">Choose how Finora looks on this device</div>
        </div>
      </div>

      <div className="grid grid-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className="card card-tight"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: active ? 'var(--shadow-focus)' : 'none',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                <Icon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                {active && <Check style={{ width: 16, height: 16, color: 'var(--color-primary)' }} />}
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{opt.label}</div>
              <div className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 2 }}>
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
