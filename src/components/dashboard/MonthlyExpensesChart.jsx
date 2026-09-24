import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getMonthlySeries } from '../../utils/calculations';

function BarTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div>{money(payload[0].value)}</div>
    </div>
  );
}

export function MonthlyExpensesChart({ months = 6 }) {
  const { transactions, money } = useFinance();
  const data = getMonthlySeries(transactions, months);
  const currentMonth = data[data.length - 1]?.month;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
          width={40}
        />
        <Tooltip content={<BarTooltip money={money} />} cursor={{ fill: 'var(--color-surface-alt)' }} />
        <Bar dataKey="expenses" radius={[6, 6, 0, 0]} maxBarSize={36}>
          {data.map((entry) => (
            <Cell
              key={entry.month}
              fill={entry.month === currentMonth ? 'var(--color-accent)' : 'var(--color-border-strong)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
