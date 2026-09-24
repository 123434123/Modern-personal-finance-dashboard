import { createContext, useContext, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { addMonths } from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { STORAGE_KEYS, clearAllFinoraStorage } from '../utils/storage';
import { generateId } from '../utils/id';
import { toISODate, formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';
import {
  calculateBudgetUsage,
  calculateGoalProgress,
  calculateFinancialHealth,
  getUpcomingBills,
  getOverdueBills,
} from '../utils/calculations';
import {
  generateSeedTransactions,
  generateSeedBudgets,
  generateSeedGoals,
  generateSeedBills,
  DEFAULT_SETTINGS,
} from '../data/seedData';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage(
    STORAGE_KEYS.transactions,
    generateSeedTransactions
  );
  const [budgets, setBudgets] = useLocalStorage(STORAGE_KEYS.budgets, generateSeedBudgets);
  const [goals, setGoals] = useLocalStorage(STORAGE_KEYS.goals, generateSeedGoals);
  const [bills, setBills] = useLocalStorage(STORAGE_KEYS.bills, generateSeedBills);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const { theme, toggleTheme, setTheme } = useTheme();

  // Reflect compact-density preference on the document root so every panel
  // (including modals rendered outside the page container) picks it up.
  useEffect(() => {
    document.body.classList.toggle('density-compact', Boolean(settings?.compactMode));
  }, [settings?.compactMode]);

  const currency = settings?.currency || 'USD';
  const money = (amount) => formatCurrency(amount, currency);

  // ---------------------------------------------------------------------
  // Transactions
  // ---------------------------------------------------------------------

  function addTransaction(data) {
    const record = { id: generateId('txn'), notes: '', ...data, amount: Number(data.amount) };
    setTransactions((prev) => [record, ...prev]);
    toast.success('Transaction added', { description: record.title });

    if (record.type === 'expense') {
      const budget = budgets.find((b) => b.category === record.category);
      if (budget) {
        const usage = calculateBudgetUsage(budget, [record, ...transactions]);
        if (usage.status === 'over') {
          toast.warning('Budget exceeded', {
            description: `${budget.category} is now over its ${money(budget.amount)} budget.`,
          });
        }
      }
    }
    return record;
  }

  function updateTransaction(id, data) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, amount: Number(data.amount ?? t.amount) } : t))
    );
    toast.success('Transaction updated');
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success('Transaction deleted');
  }

  // ---------------------------------------------------------------------
  // Budgets
  // ---------------------------------------------------------------------

  function addBudget(data) {
    const record = { id: generateId('bud'), createdAt: toISODate(), ...data, amount: Number(data.amount) };
    setBudgets((prev) => [...prev, record]);
    toast.success('Budget created', { description: record.category });
    return record;
  }

  function updateBudget(id, data) {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data, amount: Number(data.amount ?? b.amount) } : b))
    );
    toast.success('Budget updated');
  }

  function deleteBudget(id) {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast.success('Budget deleted');
  }

  // ---------------------------------------------------------------------
  // Goals
  // ---------------------------------------------------------------------

  function addGoal(data) {
    const record = {
      id: generateId('goal'),
      ...data,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
    };
    setGoals((prev) => [...prev, record]);
    toast.success('Goal created', { description: record.name });
    return record;
  }

  function updateGoal(id, data) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              ...data,
              targetAmount: Number(data.targetAmount ?? g.targetAmount),
              currentAmount: Number(data.currentAmount ?? g.currentAmount),
            }
          : g
      )
    );
    toast.success('Goal updated');
  }

  function deleteGoal(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success('Goal deleted');
  }

  function addFundsToGoal(id, amount) {
    let reached = false;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const nextAmount = Number(g.currentAmount || 0) + Number(amount);
        reached = nextAmount >= Number(g.targetAmount) && Number(g.currentAmount) < Number(g.targetAmount);
        return { ...g, currentAmount: nextAmount };
      })
    );
    if (reached) {
      toast.success('Goal reached! \uD83C\uDF89', { description: 'You hit your target amount.' });
    } else {
      toast.success('Goal updated', { description: `Added ${money(amount)}` });
    }
  }

  // ---------------------------------------------------------------------
  // Bills
  // ---------------------------------------------------------------------

  function addBill(data) {
    const record = { id: generateId('bill'), paid: false, recurring: false, ...data, amount: Number(data.amount) };
    setBills((prev) => [...prev, record]);
    toast.success('Bill added', { description: record.name });
    return record;
  }

  function updateBill(id, data) {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data, amount: Number(data.amount ?? b.amount) } : b))
    );
    toast.success('Bill updated');
  }

  function deleteBill(id) {
    setBills((prev) => prev.filter((b) => b.id !== id));
    toast.success('Bill deleted');
  }

  function markBillPaid(id) {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (b.recurring) {
          return { ...b, paid: false, dueDate: toISODate(addMonths(new Date(b.dueDate), 1)) };
        }
        return { ...b, paid: true };
      })
    );
    toast.success('Bill marked as paid');
  }

  // ---------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------

  function updateProfile(data) {
    setSettings((prev) => ({ ...prev, profile: { ...prev.profile, ...data } }));
    toast.success('Settings updated');
  }

  function updatePreferences(data) {
    setSettings((prev) => ({ ...prev, ...data }));
    toast.success('Settings updated');
  }

  function resetDemoData() {
    setTransactions(generateSeedTransactions());
    setBudgets(generateSeedBudgets());
    setGoals(generateSeedGoals());
    setBills(generateSeedBills());
    toast.success('Demo data restored');
  }

  function clearAllData() {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setBills([]);
    toast.success('Application data cleared');
  }

  function clearEverythingIncludingSettings() {
    clearAllFinoraStorage();
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setBills([]);
    setSettings(DEFAULT_SETTINGS);
    toast.success('All application data cleared');
  }

  // ---------------------------------------------------------------------
  // Derived: financial health + notification feed
  // ---------------------------------------------------------------------

  const financialHealth = useMemo(
    () => calculateFinancialHealth({ transactions, budgets, bills }),
    [transactions, budgets, bills]
  );

  const notifications = useMemo(() => {
    const items = [];

    getOverdueBills(bills).forEach((b) => {
      items.push({
        id: `overdue-${b.id}`,
        tone: 'danger',
        title: 'Bill overdue',
        message: `${b.name} (${money(b.amount)}) was due ${formatDate(b.dueDate)}.`,
        date: b.dueDate,
      });
    });

    getUpcomingBills(bills, 5).forEach((b) => {
      items.push({
        id: `upcoming-${b.id}`,
        tone: 'warning',
        title: 'Bill approaching',
        message: `${b.name} (${money(b.amount)}) is due ${formatDate(b.dueDate)}.`,
        date: b.dueDate,
      });
    });

    budgets.forEach((b) => {
      const usage = calculateBudgetUsage(b, transactions);
      if (usage.status === 'over') {
        items.push({
          id: `budget-over-${b.id}`,
          tone: 'danger',
          title: 'Budget exceeded',
          message: `${b.category} spending is at ${usage.percent}% of its ${money(b.amount)} budget.`,
          date: toISODate(),
        });
      } else if (usage.status === 'warning') {
        items.push({
          id: `budget-warn-${b.id}`,
          tone: 'warning',
          title: 'Budget nearing limit',
          message: `${b.category} spending has reached ${usage.percent}% of its budget.`,
          date: toISODate(),
        });
      }
    });

    goals.forEach((g) => {
      const progress = calculateGoalProgress(g);
      if (progress.percent >= 100) {
        items.push({
          id: `goal-${g.id}`,
          tone: 'success',
          title: 'Goal reached',
          message: `${g.name} has reached its target of ${money(g.targetAmount)}.`,
          date: toISODate(),
        });
      }
    });

    return items
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  }, [bills, budgets, transactions, goals, currency]);

  const value = {
    // raw collections
    transactions,
    budgets,
    goals,
    bills,
    settings,
    currency,
    money,

    // theme
    theme,
    toggleTheme,
    setTheme,

    // derived
    financialHealth,
    notifications,

    // transactions
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // budgets
    addBudget,
    updateBudget,
    deleteBudget,

    // goals
    addGoal,
    updateGoal,
    deleteGoal,
    addFundsToGoal,

    // bills
    addBill,
    updateBill,
    deleteBill,
    markBillPaid,

    // settings
    updateProfile,
    updatePreferences,
    resetDemoData,
    clearAllData,
    clearEverythingIncludingSettings,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within a <FinanceProvider>');
  }
  return ctx;
}
