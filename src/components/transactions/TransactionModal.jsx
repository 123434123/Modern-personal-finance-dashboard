import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { transactionSchema } from '../../utils/validationSchemas';
import { ACCOUNTS, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/seedData';
import { toISODate } from '../../utils/dateUtils';
import { useFinance } from '../../context/FinanceContext';

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

const emptyDefaults = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: toISODate(),
  account: 'Bank',
  notes: '',
};

export function TransactionModal({ open, onClose, transaction, defaultDate }) {
  const { addTransaction, updateTransaction } = useFinance();
  const isEdit = Boolean(transaction);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: emptyDefaults,
  });

  const type = watch('type');
  const categoryOptions = (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => ({
    value: c,
    label: c,
  }));

  useEffect(() => {
    if (open) {
      reset(
        transaction
          ? { ...transaction, amount: String(transaction.amount) }
          : { ...emptyDefaults, date: defaultDate || toISODate() }
      );
    }
  }, [open, transaction, defaultDate, reset]);

  useEffect(() => {
    const currentCategory = watch('category');
    const validCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (currentCategory && !validCategories.includes(currentCategory)) {
      setValue('category', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function onSubmit(data) {
    if (isEdit) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit transaction' : 'Add transaction'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-row">
          <Select label="Type" options={TYPE_OPTIONS} error={errors.type?.message} {...register('type')} />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            prefix="$"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <Input
            label="Title"
            placeholder="e.g. Whole Foods Market"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div className="field-row" style={{ marginTop: 16 }}>
          <Select
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />
          <Select
            label="Account"
            options={ACCOUNTS.map((a) => ({ value: a, label: a }))}
            error={errors.account?.message}
            {...register('account')}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        </div>

        <div style={{ marginTop: 16 }}>
          <Textarea
            label="Notes (optional)"
            rows={3}
            placeholder="Add any extra details&hellip;"
            error={errors.notes?.message}
            {...register('notes')}
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
