import { useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/dashboard/StatCard';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { MonthlyExpensesChart } from '../components/dashboard/MonthlyExpensesChart';
import { FinancialHealthCard } from '../components/dashboard/FinancialHealthCard';
import { BudgetProgressWidget } from '../components/dashboard/BudgetProgressWidget';
import { GoalsWidget } from '../components/dashboard/GoalsWidget';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { UpcomingBillsWidget } from '../components/dashboard/UpcomingBillsWidget';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { useFinance } from '../context/FinanceContext';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateSavings,
  calculateSavingsRate,
  getSpendingChange,
  getIncomeChange,
  getSavingsChange,
  getMonthRange,
  calculateBalance,
} from '../utils/calculations';

export default function Dashboard() {
  const { transactions, settings, money } = useFinance();
  const [addOpen, setAddOpen] = useState(false);

  const range = getMonthRange(0);
  const income = calculateTotalIncome(transactions, range);
  const expenses = calculateTotalExpenses(transactions, range);
  const savings = calculateSavings(transactions, range);
  const balance = calculateBalance(transactions);
  const savingsRate = calculateSavingsRate(income, expenses);

  const firstName = (settings?.profile?.name || 'there').split(' ')[0];

  return (
    <PageContainer
      title="Dashboard"
      subtitle={`Welcome back, ${firstName}. Here's your financial overview.`}
      actions={
        <Button icon={Plus} onClick={() => setAddOpen(true)}>
          Add transaction
        </Button>
      }
    >
      <div className="grid grid-stats" style={{ marginBottom: 20 }}>
        <StatCard label="Total balance" value={money(balance)} icon={Wallet} hero note={`${savingsRate.toFixed(0)}% savings rate`} />
        <StatCard label="Monthly income" value={money(income)} icon={TrendingUp} delta={getIncomeChange(transactions)} deltaGoodDirection="up" />
        <StatCard label="Monthly expenses" value={money(expenses)} icon={TrendingDown} delta={getSpendingChange(transactions)} deltaGoodDirection="down" />
        <StatCard label="Monthly savings" value={money(savings)} icon={PiggyBank} delta={getSavingsChange(transactions)} deltaGoodDirection="up" />
      </div>

      <div className="grid grid-2col" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Income vs. expenses</div>
              <div className="card-subtitle">Last 6 months</div>
            </div>
          </div>
          <IncomeExpenseChart />
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Spending by category</div>
              <div className="card-subtitle">This month</div>
            </div>
          </div>
          <CategoryDonutChart />
        </div>
      </div>

      <div className="grid grid-2col" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly expenses</div>
              <div className="card-subtitle">Last 6 months</div>
            </div>
          </div>
          <MonthlyExpensesChart />
        </div>
        <FinancialHealthCard />
      </div>

      <div className="grid grid-2col" style={{ marginBottom: 20 }}>
        <BudgetProgressWidget />
        <GoalsWidget />
      </div>

      <div className="grid grid-2col">
        <RecentTransactions />
        <UpcomingBillsWidget />
      </div>

      <TransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </PageContainer>
  );
}
