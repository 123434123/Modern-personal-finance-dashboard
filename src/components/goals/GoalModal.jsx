import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { goalSchema } from '../../utils/validationSchemas';
import { useFinance } from '../../context/FinanceContext';

const emptyDefaults = {
  name: '',
  targetAmount: '',
  currentAmount: '0',
  deadline: '',
  category: '',
  description: '',
};

export function GoalModal({ open, onClose, goal }) {
  const { addGoal, updateGoal } = useFinance();
  const isEdit = Boolean(goal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(goalSchema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (open) {
      reset(
        goal
          ? { ...goal, targetAmount: String(goal.targetAmount), currentAmount: String(goal.currentAmount) }
          : emptyDefaults
      );
    }
  }, [open, goal, reset]);

  function onSubmit(data) {
    if (isEdit) {
      updateGoal(goal.id, data);
    } else {
      addGoal(data);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit goal' : 'Create savings goal'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Goal name" placeholder="e.g. New Laptop" error={errors.name?.message} {...register('name')} />

        <div className="field-row" style={{ marginTop: 16 }}>
          <Input
            label="Target amount"
            type="number"
            step="0.01"
            min="0"
            prefix="$"
            placeholder="0.00"
            error={errors.targetAmount?.message}
            {...register('targetAmount')}
          />
          <Input
            label="Current amount"
            type="number"
            step="0.01"
            min="0"
            prefix="$"
            placeholder="0.00"
            error={errors.currentAmount?.message}
            {...register('currentAmount')}
          />
        </div>

        <div className="field-row" style={{ marginTop: 16 }}>
          <Input label="Deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
          <Input label="Category" placeholder="e.g. Travel" error={errors.category?.message} {...register('category')} />
        </div>

        <div style={{ marginTop: 16 }}>
          <Textarea
            label="Description (optional)"
            rows={3}
            placeholder="What is this goal for?"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
