import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getMonthlySeries } from '../../utils/calculations';

function Tip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 13 }}>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div>{money(payload[0].value)}</div>
    </div>
  );
}

export function ExpenseTrendChart({ transactions, months }) {
  const { money } = useFinance();
  const data = getMonthlySeries(transactions, months);
  const avg = data.reduce((sum, m) => sum + m.expenses, 0) / (data.length || 1);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
          width={40}
        />
        <ReferenceLine y={avg} stroke="var(--color-text-faint)" strokeDasharray="4 4" />
        <Tooltip content={<Tip money={money} />} cursor={{ stroke: 'var(--color-border-strong)' }} />
        <Line type="monotone" dataKey="expenses" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-accent)' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
