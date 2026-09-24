import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { addFundsSchema } from '../../utils/validationSchemas';
import { useFinance } from '../../context/FinanceContext';

export function AddFundsModal({ open, onClose, goal }) {
  const { addFundsToGoal, money } = useFinance();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(addFundsSchema), defaultValues: { amount: '' } });

  useEffect(() => {
    if (open) reset({ amount: '' });
  }, [open, reset]);

  if (!goal) return null;

  function onSubmit(data) {
    addFundsToGoal(goal.id, data.amount);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Add money to "${goal.name}"`}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 16 }}>
          Currently at {money(goal.currentAmount)} of {money(goal.targetAmount)}.
        </p>
        <Input
          label="Amount to add"
          type="number"
          step="0.01"
          min="0"
          prefix="$"
          placeholder="0.00"
          autoFocus
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add funds
          </Button>
        </div>
      </form>
    </Modal>
  );
}
