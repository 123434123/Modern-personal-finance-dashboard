import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryBreakdown, getMonthRange } from '../../utils/calculations';
import { categoryChartColor } from '../../utils/categoryMeta';
import { EmptyState } from '../ui/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';

function DonutTooltip({ active, payload, money }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
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
      <strong>{item.category}</strong>
      <div>{money(item.value)} &middot; {item.percent}%</div>
    </div>
  );
}

export function CategoryDonutChart({ range = getMonthRange(0) }) {
  const { transactions, money } = useFinance();
  const data = getCategoryBreakdown(transactions, 'expense', range);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={PieIcon}
        title="No spending yet"
        description="Add an expense to see your category breakdown."
      />
    );
  }

  return (
    <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
      <div style={{ width: 160, height: 160, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              stroke="var(--color-surface)"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={categoryChartColor(entry.category)} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip money={money} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
        {data.slice(0, 6).map((entry) => (
          <div key={entry.category} className="flex items-center justify-between" style={{ padding: '6px 0' }}>
            <span className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: categoryChartColor(entry.category),
                  display: 'inline-block',
                }}
              />
              {entry.category}
            </span>
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              {entry.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
