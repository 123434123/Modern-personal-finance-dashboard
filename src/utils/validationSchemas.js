import { z } from 'zod';

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(80, 'Title is too long'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .gt(0, 'Amount must be greater than 0'),
  type: z.enum(['income', 'expense'], { required_error: 'Type is required' }),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  account: z.string().min(1, 'Account is required'),
  notes: z.string().max(280, 'Notes are too long').optional().or(z.literal('')),
});

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .gt(0, 'Budget amount must be greater than 0'),
});

export const goalSchema = z.object({
  name: z.string().trim().min(1, 'Goal name is required').max(60, 'Name is too long'),
  targetAmount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .gt(0, 'Target amount must be greater than 0'),
  currentAmount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .min(0, 'Current amount cannot be negative'),
  deadline: z.string().min(1, 'Deadline is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(200, 'Description is too long').optional().or(z.literal('')),
});

export const addFundsSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .gt(0, 'Amount must be greater than 0'),
});

export const billSchema = z.object({
  name: z.string().trim().min(1, 'Bill name is required').max(60, 'Name is too long'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .gt(0, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
  category: z.string().min(1, 'Category is required'),
  recurring: z.boolean().optional(),
  paid: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Name is too long'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  jobTitle: z.string().max(60, 'Job title is too long').optional().or(z.literal('')),
});

export const preferencesSchema = z.object({
  currency: z.enum(['USD', 'EUR', 'GBP', 'EGP']),
  notifications: z.boolean(),
  compactMode: z.boolean(),
});
