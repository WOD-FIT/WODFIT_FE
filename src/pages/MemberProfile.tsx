import { useNavigate } from 'react-router';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

export default function MemberProfile() {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/my');
  };

  return (
    <PageContainer>
      <PageHeader title="프로필 정보" />
      <ProfileForm onSave={handleSave} />
    </PageContainer>
  );
}
