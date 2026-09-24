import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { profileSchema } from '../../utils/validationSchemas';
import { useFinance } from '../../context/FinanceContext';

export function ProfileForm() {
  const { settings, updateProfile } = useFinance();
  const profile = settings?.profile || {};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name || '', email: profile.email || '', jobTitle: profile.jobTitle || '' },
  });

  const watchedName = watch('name');

  function onSubmit(data) {
    updateProfile(data);
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Profile</div>
          <div className="card-subtitle">Your personal information</div>
        </div>
      </div>

      <div className="flex items-center gap-4" style={{ marginBottom: 24 }}>
        <Avatar name={watchedName || profile.name} size={56} />
        <div>
          <div style={{ fontWeight: 600 }}>{watchedName || profile.name}</div>
          <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            Avatar is generated automatically from your name.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-row">
          <Input label="Full name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        </div>
        <div style={{ marginTop: 16 }}>
          <Input label="Job title" placeholder="e.g. Senior Product Designer" error={errors.jobTitle?.message} {...register('jobTitle')} />
        </div>
        <div className="form-actions">
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save profile
          </Button>
        </div>
      </form>
    </div>
  );
}
