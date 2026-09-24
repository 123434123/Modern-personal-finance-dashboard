import { useMemo, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { SummaryStats } from '../components/analytics/SummaryStats';
import { IncomeExpenseTrend } from '../components/analytics/IncomeExpenseTrend';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { MonthlySavingsChart } from '../components/analytics/MonthlySavingsChart';
import { ExpenseTrendChart } from '../components/analytics/ExpenseTrendChart';
import { BudgetPerformanceChart } from '../components/analytics/BudgetPerformanceChart';
import { useFinance } from '../context/FinanceContext';
import { getRangeForFilter, monthsCountForFilter } from '../utils/dateUtils';

const DEFAULT_FILTERS = { range: 'last-6-months', type: 'all', category: 'all' };

export default function Analytics() {
  const { transactions } = useFinance();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (filters.type === 'all' || t.type === filters.type) &&
          (filters.category === 'all' || t.category === filters.category)
      ),
    [transactions, filters.type, filters.category]
  );

  const range = getRangeForFilter(filters.range);
  const months = monthsCountForFilter(filters.range);
  const breakdownType = filters.type === 'income' ? 'income' : 'expense';

  return (
    <PageContainer title="Analytics" subtitle="Understand your spending patterns and trends over time.">
      <AnalyticsFilters filters={filters} onChange={setFilters} />
      <SummaryStats filteredTransactions={filteredTransactions} range={range} rangeId={filters.range} />

      <div className="grid grid-2col" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Income vs. expenses</div>
              <div className="card-subtitle">Reacts to your filters above</div>
            </div>
          </div>
          <IncomeExpenseTrend transactions={filteredTransactions} months={months} />
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Spending by category</div>
              <div className="card-subtitle">{breakdownType === 'income' ? 'Income sources' : 'Expense breakdown'}</div>
            </div>
          </div>
          <CategoryBreakdownChart transactions={filteredTransactions} range={range} transactionType={breakdownType} />
        </div>
      </div>

      <div className="grid grid-2col" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly savings</div>
              <div className="card-subtitle">Income minus expenses, per month</div>
            </div>
          </div>
          <MonthlySavingsChart transactions={filteredTransactions} months={months} />
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Expense trends</div>
              <div className="card-subtitle">Dashed line marks your average</div>
            </div>
          </div>
          <ExpenseTrendChart transactions={filteredTransactions} months={months} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Budget performance</div>
            <div className="card-subtitle">Current month, percent of budget used</div>
          </div>
        </div>
        <BudgetPerformanceChart />
      </div>
    </PageContainer>
  );
}
