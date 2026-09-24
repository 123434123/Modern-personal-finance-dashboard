import { subMonths, setDate, addDays } from 'date-fns';
import { toISODate } from '../utils/dateUtils';
import { generateId } from '../utils/id';

// Seed data is generated relative to "today" so the demo always looks like a
// live account with roughly six months of history, no matter when the app
// is first opened.

function dateFor(monthsAgo, day) {
  const base = setDate(subMonths(new Date(), monthsAgo), Math.min(Math.max(day, 1), 28));
  return toISODate(base);
}

function futureDate(daysFromNow) {
  return toISODate(addDays(new Date(), daysFromNow));
}

// ---------------------------------------------------------------------------
// Transactions — six months of income + everyday spending
// ---------------------------------------------------------------------------

const monthPlans = [
  {
    monthsAgo: 5,
    income: [
      { day: 1, title: 'Monthly salary deposit', amount: 4250, category: 'Salary', account: 'Bank' },
    ],
    expenses: [
      { day: 2, title: 'Apartment rent', amount: 1450, category: 'Bills', account: 'Bank' },
      { day: 4, title: 'Whole Foods Market', amount: 92.4, category: 'Food', account: 'Credit Card' },
      { day: 6, title: 'Shell Gas Station', amount: 48.1, category: 'Transport', account: 'Credit Card' },
      { day: 9, title: 'Netflix subscription', amount: 15.49, category: 'Entertainment', account: 'Credit Card' },
      { day: 11, title: 'Trader Joe\u2019s', amount: 57.3, category: 'Food', account: 'Cash' },
      { day: 14, title: 'CVS Pharmacy', amount: 26.75, category: 'Health', account: 'Credit Card' },
      { day: 18, title: 'Zara', amount: 118.0, category: 'Shopping', account: 'Credit Card' },
      { day: 22, title: 'Uber rides', amount: 34.6, category: 'Transport', account: 'Cash' },
      { day: 27, title: 'Blue Bottle Coffee', amount: 12.8, category: 'Food', account: 'Cash' },
    ],
  },
  {
    monthsAgo: 4,
    income: [
      { day: 1, title: 'Monthly salary deposit', amount: 4250, category: 'Salary', account: 'Bank' },
      { day: 16, title: 'UI design contract \u2014 Nova Studio', amount: 620, category: 'Freelance', account: 'Bank' },
    ],
    expenses: [
      { day: 2, title: 'Apartment rent', amount: 1450, category: 'Bills', account: 'Bank' },
      { day: 5, title: 'Whole Foods Market', amount: 104.2, category: 'Food', account: 'Credit Card' },
      { day: 7, title: 'Anytime Fitness membership', amount: 42.0, category: 'Health', account: 'Bank' },
      { day: 10, title: 'Amazon.com order', amount: 76.55, category: 'Shopping', account: 'Credit Card' },
      { day: 13, title: 'Metro transit pass', amount: 60.0, category: 'Transport', account: 'Cash' },
      { day: 17, title: 'AMC Theatres', amount: 28.5, category: 'Entertainment', account: 'Credit Card' },
      { day: 20, title: 'Trader Joe\u2019s', amount: 61.9, category: 'Food', account: 'Cash' },
      { day: 25, title: 'Spotify Premium', amount: 10.99, category: 'Entertainment', account: 'Credit Card' },
      { day: 28, title: 'Coursera \u2014 Data Analysis course', amount: 49.0, category: 'Education', account: 'Credit Card' },
    ],
  },
  {
    monthsAgo: 3,
    income: [
      { day: 1, title: 'Monthly salary deposit', amount: 4300, category: 'Salary', account: 'Bank' },
    ],
    expenses: [
      { day: 2, title: 'Apartment rent', amount: 1450, category: 'Bills', account: 'Bank' },
      { day: 3, title: 'Delta Airlines \u2014 flight to Denver', amount: 410.0, category: 'Travel', account: 'Credit Card' },
      { day: 4, title: 'Marriott Hotel \u2014 weekend stay', amount: 260.0, category: 'Travel', account: 'Credit Card' },
      { day: 8, title: 'Whole Foods Market', amount: 88.15, category: 'Food', account: 'Credit Card' },
      { day: 12, title: 'Shell Gas Station', amount: 51.2, category: 'Transport', account: 'Credit Card' },
      { day: 15, title: 'Nour El-Nil Restaurant', amount: 64.0, category: 'Food', account: 'Cash' },
      { day: 19, title: 'CVS Pharmacy', amount: 18.4, category: 'Health', account: 'Credit Card' },
      { day: 23, title: 'Netflix subscription', amount: 15.49, category: 'Entertainment', account: 'Credit Card' },
      { day: 26, title: 'Charity donation \u2014 Red Cross', amount: 50.0, category: 'Other', account: 'Bank' },
    ],
  },
  {
    monthsAgo: 2,
    income: [
      { day: 1, title: 'Monthly salary deposit', amount: 4300, category: 'Salary', account: 'Bank' },
      { day: 19, title: 'Logo design project \u2014 Ember & Co', amount: 380, category: 'Freelance', account: 'Bank' },
    ],
    expenses: [
      { day: 2, title: 'Apartment rent', amount: 1450, category: 'Bills', account: 'Bank' },
      { day: 6, title: 'Trader Joe\u2019s', amount: 65.75, category: 'Food', account: 'Cash' },
      { day: 9, title: 'Uber rides', amount: 41.3, category: 'Transport', account: 'Cash' },
      { day: 11, title: 'Anytime Fitness membership', amount: 42.0, category: 'Health', account: 'Bank' },
      { day: 14, title: 'Amazon.com order', amount: 132.9, category: 'Shopping', account: 'Credit Card' },
      { day: 17, title: 'Dr. Sarah Chen \u2014 checkup', amount: 95.0, category: 'Health', account: 'Bank' },
      { day: 21, title: 'Whole Foods Market', amount: 97.6, category: 'Food', account: 'Credit Card' },
      { day: 24, title: 'Spotify Premium', amount: 10.99, category: 'Entertainment', account: 'Credit Card' },
      { day: 27, title: 'O\u2019Reilly \u2014 technical textbook', amount: 38.5, category: 'Education', account: 'Credit Card' },
    ],
  },
  {
    monthsAgo: 1,
    income: [
      { day: 1, title: 'Monthly salary deposit', amount: 4300, category: 'Salary', account: 'Bank' },
    ],
    expenses: [
      { day: 2, title: 'Apartment rent', amount: 1450, category: 'Bills', account: 'Bank' },
      { day: 5, title: 'Whole Foods Market', amount: 101.3, category: 'Food', account: 'Credit Card' },
      { day: 8, title: 'Shell Gas Station', amount: 55.4, category: 'Transport', account: 'Credit Card' },
      { day: 10, title: 'Zara', amount: 89.0, category: 'Shopping', account: 'Credit Card' },
      { day: 13, title: 'Netflix subscription', amount: 15.49, category: 'Entertainment', account: 'Credit Card' },
      { day: 16, title: 'Trader Joe\u2019s', amount: 58.2, category: 'Food', account: 'Cash' },
      { day: 20, title: 'CVS Pharmacy', amount: 22.1, category: 'Health', account: 'Credit Card' },
      { day: 24, title: 'Blue Bottle Coffee', amount: 16.4, category: 'Food', account: 'Cash' },
      { day: 26, title: 'Gift \u2014 birthday present', amount: 45.0, category: 'Other', account: 'Cash' },
    ],
  },
  {
    monthsAgo: 0,
    income: [
      { day: 1, title: 'Monthly salary deposit', amount: 4300, category: 'Salary', account: 'Bank' },
      { day: 8, title: 'Brand identity project \u2014 Solace Wellness', amount: 540, category: 'Freelance', account: 'Bank' },
    ],
    expenses: [
      { day: 2, title: 'Apartment rent', amount: 1450, category: 'Bills', account: 'Bank' },
      { day: 4, title: 'Whole Foods Market', amount: 95.8, category: 'Food', account: 'Credit Card' },
      { day: 6, title: 'Uber rides', amount: 29.9, category: 'Transport', account: 'Cash' },
      { day: 9, title: 'Anytime Fitness membership', amount: 42.0, category: 'Health', account: 'Bank' },
      { day: 12, title: 'Amazon.com order', amount: 68.25, category: 'Shopping', account: 'Credit Card' },
      { day: 15, title: 'Spotify Premium', amount: 10.99, category: 'Entertainment', account: 'Credit Card' },
    ],
  },
];

function buildTransactions() {
  const transactions = [];
  monthPlans.forEach(({ monthsAgo, income, expenses }) => {
    income.forEach((item) => {
      transactions.push({
        id: generateId('txn'),
        title: item.title,
        amount: item.amount,
        type: 'income',
        category: item.category,
        date: dateFor(monthsAgo, item.day),
        account: item.account,
        notes: '',
      });
    });
    expenses.forEach((item) => {
      transactions.push({
        id: generateId('txn'),
        title: item.title,
        amount: item.amount,
        type: 'expense',
        category: item.category,
        date: dateFor(monthsAgo, item.day),
        account: item.account,
        notes: '',
      });
    });
  });
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function generateSeedTransactions() {
  return buildTransactions();
}

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------

export function generateSeedBudgets() {
  return [
    { id: generateId('bud'), category: 'Food', amount: 500 },
    { id: generateId('bud'), category: 'Shopping', amount: 200 },
    { id: generateId('bud'), category: 'Transport', amount: 180 },
    { id: generateId('bud'), category: 'Bills', amount: 1500 },
    { id: generateId('bud'), category: 'Entertainment', amount: 80 },
    { id: generateId('bud'), category: 'Health', amount: 150 },
    { id: generateId('bud'), category: 'Education', amount: 100 },
    { id: generateId('bud'), category: 'Other', amount: 120 },
  ].map((b) => ({ ...b, createdAt: toISODate(subMonths(new Date(), 5)) }));
}

// ---------------------------------------------------------------------------
// Savings goals
// ---------------------------------------------------------------------------

export function generateSeedGoals() {
  return [
    {
      id: generateId('goal'),
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6450,
      deadline: futureDate(150),
      category: 'Savings',
      description: 'Three to six months of essential living expenses set aside for the unexpected.',
    },
    {
      id: generateId('goal'),
      name: 'New Laptop',
      targetAmount: 2200,
      currentAmount: 1380,
      deadline: futureDate(60),
      category: 'Electronics',
      description: 'Replacing my aging laptop with a machine that can handle design work.',
    },
    {
      id: generateId('goal'),
      name: 'Vacation to Portugal',
      targetAmount: 3200,
      currentAmount: 940,
      deadline: futureDate(210),
      category: 'Travel',
      description: 'Two weeks along the coast in the spring.',
    },
    {
      id: generateId('goal'),
      name: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 2100,
      deadline: futureDate(365),
      category: 'Transport',
      description: 'Saving toward a down payment on a reliable used car.',
    },
    {
      id: generateId('goal'),
      name: 'Wedding Fund',
      targetAmount: 15000,
      currentAmount: 3200,
      deadline: futureDate(480),
      category: 'Life Event',
      description: 'Building up savings ahead of the big day.',
    },
  ];
}

// ---------------------------------------------------------------------------
// Bills
// ---------------------------------------------------------------------------

export function generateSeedBills() {
  return [
    { id: generateId('bill'), name: 'Apartment Rent', amount: 1450, dueDate: futureDate(3), category: 'Bills', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Electricity', amount: 78.4, dueDate: futureDate(5), category: 'Bills', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Internet Service', amount: 59.99, dueDate: futureDate(8), category: 'Bills', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Netflix', amount: 15.49, dueDate: futureDate(12), category: 'Entertainment', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Phone Plan', amount: 45.0, dueDate: futureDate(-2), category: 'Bills', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Health Insurance', amount: 210.0, dueDate: futureDate(20), category: 'Health', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Car Insurance', amount: 96.5, dueDate: futureDate(26), category: 'Transport', recurring: true, paid: false },
    { id: generateId('bill'), name: 'Spotify Premium', amount: 10.99, dueDate: futureDate(-9), category: 'Entertainment', recurring: true, paid: true },
  ];
}

export const ACCOUNTS = ['Cash', 'Bank', 'Credit Card', 'Savings'];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Other',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Other'];

export const ALL_CATEGORIES = [
  'Salary',
  'Freelance',
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Other',
];

export const DEFAULT_SETTINGS = {
  profile: {
    name: 'Amelia Novak',
    email: 'amelia.novak@example.com',
    jobTitle: 'Senior Product Designer',
  },
  currency: 'USD',
  notifications: true,
  compactMode: false,
};
