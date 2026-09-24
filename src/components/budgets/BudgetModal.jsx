import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { budgetSchema } from '../../utils/validationSchemas';
import { EXPENSE_CATEGORIES } from '../../data/seedData';
import { useFinance } from '../../context/FinanceContext';

const emptyDefaults = { category: '', amount: '' };

export function BudgetModal({ open, onClose, budget }) {
  const { addBudget, updateBudget } = useFinance();
  const isEdit = Boolean(budget);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(budgetSchema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (open) {
      reset(budget ? { category: budget.category, amount: String(budget.amount) } : emptyDefaults);
    }
  }, [open, budget, reset]);

  function onSubmit(data) {
    if (isEdit) {
      updateBudget(budget.id, data);
    } else {
      addBudget(data);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit budget' : 'Create budget'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select
          label="Category"
          placeholder="Select category"
          options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.category?.message}
          {...register('category')}
        />
        <div style={{ marginTop: 16 }}>
          <Input
            label="Monthly budget amount"
            type="number"
            step="0.01"
            min="0"
            prefix="$"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </div>
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
