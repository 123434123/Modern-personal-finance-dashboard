import { StatCard } from '../dashboard/StatCard';
import { TrendingUp, TrendingDown, PiggyBank, Percent, BarChart2, Tag, Activity } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateSavings,
  calculateSavingsRate,
  getAverageMonthlySpending,
  getHighestSpendingCategory,
  getSpendingChange,
} from '../../utils/calculations';
import { monthsCountForFilter } from '../../utils/dateUtils';

export function SummaryStats({ filteredTransactions, range, rangeId }) {
  const { money } = useFinance();

  const income = calculateTotalIncome(filteredTransactions, range);
  const expenses = calculateTotalExpenses(filteredTransactions, range);
  const savings = calculateSavings(filteredTransactions, range);
  const savingsRate = calculateSavingsRate(income, expenses);
  const avgMonthly = getAverageMonthlySpending(filteredTransactions, monthsCountForFilter(rangeId));
  const highest = getHighestSpendingCategory(filteredTransactions, range);
  const monthlyChange = getSpendingChange(filteredTransactions);

  return (
    <div className="grid grid-4" style={{ marginBottom: 20 }}>
      <StatCard label="Total income" value={money(income)} icon={TrendingUp} />
      <StatCard label="Total expenses" value={money(expenses)} icon={TrendingDown} />
      <StatCard label="Total savings" value={money(savings)} icon={PiggyBank} />
      <StatCard label="Savings rate" value={`${savingsRate.toFixed(1)}%`} icon={Percent} />
      <StatCard label="Avg. monthly spending" value={money(avgMonthly)} icon={BarChart2} />
      <StatCard label="Highest category" value={highest ? highest.category : '—'} icon={Tag} note={highest ? money(highest.value) : 'No spending'} />
      <StatCard label="Monthly change" value={`${monthlyChange >= 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`} icon={Activity} note="vs. last month" />
    </div>
  );
}
