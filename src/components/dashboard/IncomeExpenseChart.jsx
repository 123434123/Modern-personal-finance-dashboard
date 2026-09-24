import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getMonthlySeries } from '../../utils/calculations';

function ChartTooltip({ active, payload, label, money }) {
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
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', gap: 16, justifyContent: 'space-between', color: p.color }}>
          <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>
          <span>{money(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function IncomeExpenseChart({ months = 6 }) {
  const { transactions, money } = useFinance();
  const data = getMonthlySeries(transactions, months);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Tooltip content={<ChartTooltip money={money} />} cursor={{ stroke: 'var(--color-border-strong)' }} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 12 }}
        />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          fill="url(#incomeFill)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="var(--chart-5)"
          strokeWidth={2.5}
          fill="url(#expenseFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
