import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
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

export function MonthlySavingsChart({ transactions, months }) {
  const { money } = useFinance();
  const data = getMonthlySeries(transactions, months);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }}
          tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : v)}
          width={44}
        />
        <ReferenceLine y={0} stroke="var(--color-border-strong)" />
        <Tooltip content={<Tip money={money} />} cursor={{ fill: 'var(--color-surface-alt)' }} />
        <Bar dataKey="savings" radius={[6, 6, 6, 6]} maxBarSize={36}>
          {data.map((entry) => (
            <Cell key={entry.month} fill={entry.savings >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
