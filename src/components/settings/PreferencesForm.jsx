import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { preferencesSchema } from '../../utils/validationSchemas';
import { useFinance } from '../../context/FinanceContext';
import { CURRENCIES } from '../../utils/formatters';

const CURRENCY_OPTIONS = Object.values(CURRENCIES).map((c) => ({
  value: c.code,
  label: `${c.code} (${c.symbol})`,
}));

export function PreferencesForm() {
  const { settings, updatePreferences } = useFinance();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      currency: settings?.currency || 'USD',
      notifications: settings?.notifications ?? true,
      compactMode: settings?.compactMode ?? false,
    },
  });

  function onSubmit(data) {
    updatePreferences(data);
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Preferences</div>
          <div className="card-subtitle">Currency, notifications, and layout density</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select
          label="Currency"
          options={CURRENCY_OPTIONS}
          hint="Changes how amounts are displayed. Figures are not converted between currencies."
          {...register('currency')}
        />

        <div className="checkbox-row" style={{ marginTop: 20 }}>
          <label className="switch">
            <input type="checkbox" {...register('notifications')} />
            <span className="switch-track" />
          </label>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Notifications</div>
            <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              Show toast alerts for budgets, bills, and goals.
            </div>
          </div>
        </div>

        <div className="checkbox-row" style={{ marginTop: 16 }}>
          <label className="switch">
            <input type="checkbox" {...register('compactMode')} />
            <span className="switch-track" />
          </label>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Compact mode</div>
            <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              Reduce spacing to fit more on screen.
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
