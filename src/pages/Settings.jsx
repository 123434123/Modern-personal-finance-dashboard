import { PageContainer } from '../components/layout/PageContainer';
import { ProfileForm } from '../components/settings/ProfileForm';
import { PreferencesForm } from '../components/settings/PreferencesForm';
import { AppearanceSection } from '../components/settings/AppearanceSection';
import { DataSection } from '../components/settings/DataSection';

export default function Settings() {
  return (
    <PageContainer title="Settings" subtitle="Manage your profile, preferences, and application data.">
      <div className="grid grid-2col" style={{ alignItems: 'start' }}>
        <div className="flex flex-col gap-4" style={{ gap: 20 }}>
          <ProfileForm />
          <DataSection />
        </div>
        <div className="flex flex-col gap-4" style={{ gap: 20 }}>
          <PreferencesForm />
          <AppearanceSection />
        </div>
      </div>
    </PageContainer>
  );
}
