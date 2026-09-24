import { format, startOfMonth, endOfMonth, subMonths, isSameMonth } from 'date-fns';
import { toDate, isDateWithinRange, daysUntil, isOverdue } from './dateUtils';

// ---------------------------------------------------------------------------
// Core totals
// ---------------------------------------------------------------------------

export function calculateTotalIncome(transactions = [], range) {
  return transactions
    .filter((t) => t.type === 'income' && (!range || isDateWithinRange(t.date, range)))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function calculateTotalExpenses(transactions = [], range) {
  return transactions
    .filter((t) => t.type === 'expense' && (!range || isDateWithinRange(t.date, range)))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function calculateBalance(transactions = []) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

export function calculateSavings(transactions = [], range) {
  return calculateTotalIncome(transactions, range) - calculateTotalExpenses(transactions, range);
}

export function calculateSavingsRate(income, expenses) {
  if (!income || income <= 0) return 0;
  const rate = ((income - expenses) / income) * 100;
  return Math.max(-999, Math.min(100, rate));
}

// ---------------------------------------------------------------------------
// Month-over-month change (used for "spending change" & stat deltas)
// ---------------------------------------------------------------------------

export function getMonthRange(offsetFromCurrent = 0) {
  const base = subMonths(new Date(), offsetFromCurrent);
  return { start: startOfMonth(base), end: endOfMonth(base) };
}

export function percentChange(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function getSpendingChange(transactions = []) {
  const current = calculateTotalExpenses(transactions, getMonthRange(0));
  const previous = calculateTotalExpenses(transactions, getMonthRange(1));
  return percentChange(current, previous);
}

export function getIncomeChange(transactions = []) {
  const current = calculateTotalIncome(transactions, getMonthRange(0));
  const previous = calculateTotalIncome(transactions, getMonthRange(1));
  return percentChange(current, previous);
}

export function getSavingsChange(transactions = []) {
  const current = calculateSavings(transactions, getMonthRange(0));
  const previous = calculateSavings(transactions, getMonthRange(1));
  return percentChange(current, previous);
}

// ---------------------------------------------------------------------------
// Time series for charts
// ---------------------------------------------------------------------------

export function getMonthlySeries(transactions = [], months = 6) {
  const series = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const monthDate = subMonths(new Date(), i);
    const range = { start: startOfMonth(monthDate), end: endOfMonth(monthDate) };
    const income = calculateTotalIncome(transactions, range);
    const expenses = calculateTotalExpenses(transactions, range);
    series.push({
      month: format(monthDate, 'MMM'),
      fullMonth: format(monthDate, 'MMMM yyyy'),
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(income - expenses),
    });
  }
  return series;
}

export function getCategoryBreakdown(transactions = [], type = 'expense', range) {
  const filtered = transactions.filter(
    (t) => t.type === type && (!range || isDateWithinRange(t.date, range))
  );
  const total = filtered.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const byCategory = new Map();

  filtered.forEach((t) => {
    const key = t.category || 'Other';
    byCategory.set(key, (byCategory.get(key) || 0) + Number(t.amount || 0));
  });

  return Array.from(byCategory.entries())
    .map(([category, value]) => ({
      category,
      value: Math.round(value * 100) / 100,
      percent: total > 0 ? Math.round((value / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export function getHighestSpendingCategory(transactions = [], range) {
  const breakdown = getCategoryBreakdown(transactions, 'expense', range);
  return breakdown[0] || null;
}

export function getAverageMonthlySpending(transactions = [], months = 6) {
  const series = getMonthlySeries(transactions, months);
  if (series.length === 0) return 0;
  const total = series.reduce((sum, m) => sum + m.expenses, 0);
  return total / series.length;
}

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------

export function getBudgetSpent(budget, transactions = []) {
  const range = getMonthRange(0);
  return transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category === budget.category &&
        isDateWithinRange(t.date, range)
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function calculateBudgetUsage(budget, transactions = []) {
  const spent = getBudgetSpent(budget, transactions);
  const amount = Number(budget.amount || 0);
  const remaining = amount - spent;
  const percent = amount > 0 ? Math.round((spent / amount) * 100) : 0;
  let status = 'healthy';
  if (percent >= 100) status = 'over';
  else if (percent >= 80) status = 'warning';
  return { spent, remaining, percent: Math.min(percent, 999), status };
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

export function calculateGoalProgress(goal) {
  const target = Number(goal.targetAmount || 0);
  const current = Number(goal.currentAmount || 0);
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const remaining = Math.max(0, target - current);
  const daysLeft = goal.deadline ? daysUntil(goal.deadline) : null;

  let estimatedCompletion = 'On track';
  if (percent >= 100) estimatedCompletion = 'Goal reached';
  else if (daysLeft !== null && daysLeft < 0) estimatedCompletion = 'Deadline passed';
  else if (daysLeft !== null && daysLeft <= 30 && percent < 80) estimatedCompletion = 'Behind schedule';

  return { percent, remaining, daysLeft, estimatedCompletion };
}

// ---------------------------------------------------------------------------
// Bills
// ---------------------------------------------------------------------------

export function getUpcomingBills(bills = [], days = 14) {
  return bills
    .filter((b) => !b.paid && daysUntil(b.dueDate) >= 0 && daysUntil(b.dueDate) <= days)
    .sort((a, b) => toDate(a.dueDate) - toDate(b.dueDate));
}

export function getOverdueBills(bills = []) {
  return bills.filter((b) => !b.paid && isOverdue(b.dueDate));
}

// ---------------------------------------------------------------------------
// Financial health score
// ---------------------------------------------------------------------------

export function calculateFinancialHealth({ transactions = [], budgets = [], bills = [] }) {
  const income = calculateTotalIncome(transactions, getMonthRange(0));
  const expenses = calculateTotalExpenses(transactions, getMonthRange(0));
  const savingsRate = calculateSavingsRate(income, expenses);

  // 1. Savings rate component (0-40 pts)
  const savingsScore = Math.max(0, Math.min(40, (savingsRate / 20) * 40));

  // 2. Budget discipline component (0-30 pts): fewer over-budget categories is better
  let budgetScore = 30;
  if (budgets.length > 0) {
    const overCount = budgets.filter(
      (b) => calculateBudgetUsage(b, transactions).status === 'over'
    ).length;
    const warnCount = budgets.filter(
      (b) => calculateBudgetUsage(b, transactions).status === 'warning'
    ).length;
    budgetScore = Math.max(0, 30 - overCount * 12 - warnCount * 4);
  }

  // 3. Bills component (0-20 pts): overdue bills hurt the score
  const overdue = getOverdueBills(bills).length;
  const billsScore = Math.max(0, 20 - overdue * 10);

  // 4. Spending trend component (0-10 pts)
  const spendingChange = getSpendingChange(transactions);
  const trendScore = spendingChange <= 0 ? 10 : Math.max(0, 10 - spendingChange / 5);

  const total = Math.round(savingsScore + budgetScore + billsScore + trendScore);

  let label = 'Needs Attention';
  if (total >= 85) label = 'Excellent';
  else if (total >= 65) label = 'Good';
  else if (total >= 40) label = 'Needs Attention';
  else label = 'Critical';

  return {
    score: Math.max(0, Math.min(100, total)),
    label,
    savingsRate,
    overdueBills: overdue,
  };
}

export function isSameMonthAsNow(dateValue) {
  return isSameMonth(toDate(dateValue), new Date());
}
