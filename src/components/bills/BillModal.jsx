import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { billSchema } from '../../utils/validationSchemas';
import { ALL_CATEGORIES } from '../../data/seedData';
import { toISODate } from '../../utils/dateUtils';
import { useFinance } from '../../context/FinanceContext';

function defaultsFor(defaultDate) {
  return {
    name: '',
    amount: '',
    dueDate: defaultDate || toISODate(),
    category: 'Bills',
    recurring: false,
  };
}

export function BillModal({ open, onClose, bill, defaultDate }) {
  const { addBill, updateBill } = useFinance();
  const isEdit = Boolean(bill);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(billSchema), defaultValues: defaultsFor() });

  useEffect(() => {
    if (open) {
      reset(bill ? { ...bill, amount: String(bill.amount) } : defaultsFor(defaultDate));
    }
  }, [open, bill, defaultDate, reset]);

  function onSubmit(data) {
    if (isEdit) {
      updateBill(bill.id, data);
    } else {
      addBill(data);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit bill' : 'Add bill'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Bill name" placeholder="e.g. Internet Service" error={errors.name?.message} {...register('name')} />

        <div className="field-row" style={{ marginTop: 16 }}>
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
          <Input label="Due date" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        </div>

        <div style={{ marginTop: 16 }}>
          <Select
            label="Category"
            options={ALL_CATEGORIES.map((c) => ({ value: c, label: c }))}
            error={errors.category?.message}
            {...register('category')}
          />
        </div>

        <div className="checkbox-row" style={{ marginTop: 16 }}>
          <label className="switch">
            <input type="checkbox" {...register('recurring')} />
            <span className="switch-track" />
          </label>
          <span style={{ fontSize: 'var(--text-sm)' }}>Repeats every month</span>
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Add bill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
