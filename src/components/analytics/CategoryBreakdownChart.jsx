import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryBreakdown } from '../../utils/calculations';
import { categoryChartColor } from '../../utils/categoryMeta';
import { EmptyState } from '../ui/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';

function DonutTooltip({ active, payload, money }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 13 }}>
      <strong>{item.category}</strong>
      <div>{money(item.value)} &middot; {item.percent}%</div>
    </div>
  );
}

export function CategoryBreakdownChart({ transactions, range, transactionType = 'expense' }) {
  const { money } = useFinance();
  const data = getCategoryBreakdown(transactions, transactionType, range);

  if (data.length === 0) {
    return <EmptyState icon={PieIcon} title="No data for this range" description="Try a different filter or date range." />;
  }

  return (
    <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
      <div style={{ width: 170, height: 170, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="category" innerRadius={54} outerRadius={82} paddingAngle={2} stroke="var(--color-surface)" strokeWidth={2}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={categoryChartColor(entry.category)} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip money={money} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        {data.map((entry) => (
          <div key={entry.category} className="flex items-center justify-between" style={{ padding: '6px 0' }}>
            <span className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: categoryChartColor(entry.category), display: 'inline-block' }} />
              {entry.category}
            </span>
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              {money(entry.value)} &middot; {entry.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
