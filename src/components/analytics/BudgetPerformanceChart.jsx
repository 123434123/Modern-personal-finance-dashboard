import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { calculateBudgetUsage } from '../../utils/calculations';
import { EmptyState } from '../ui/EmptyState';
import { PiggyBank } from 'lucide-react';

const STATUS_COLOR = { healthy: 'var(--color-accent)', warning: 'var(--color-warning)', over: 'var(--color-danger)' };

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 13 }}>
      <div style={{ fontWeight: 600 }}>{item.category}</div>
      <div>{item.percent}% of budget used</div>
    </div>
  );
}

export function BudgetPerformanceChart() {
  const { budgets, transactions } = useFinance();

  if (budgets.length === 0) {
    return <EmptyState icon={PiggyBank} title="No budgets to measure" description="Create a budget to see performance here." />;
  }

  const data = budgets
    .map((b) => {
      const usage = calculateBudgetUsage(b, transactions);
      return { category: b.category, percent: usage.percent, status: usage.status };
    })
    .sort((a, b) => b.percent - a.percent);

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--color-border)" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-text-faint)', fontSize: 12 }}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="category"
          tickLine={false}
          axisLine={false}
          width={90}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
        />
        <ReferenceLine x={100} stroke="var(--color-danger)" strokeDasharray="4 4" />
        <Tooltip content={<Tip />} cursor={{ fill: 'var(--color-surface-alt)' }} />
        <Bar dataKey="percent" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={STATUS_COLOR[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
