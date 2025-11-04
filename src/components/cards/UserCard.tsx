import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Profile = {
  boxName?: string;
};

export const UserCard = () => {
  const { user } = useAuth();
  // 사용자별로 프로필을 분리하여 저장
  const profileKey = user?.email ? `member_profile_${user.email}` : 'member_profile';
  const [profile] = useLocalStorage<Profile>(profileKey, {});

  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src="/icons/profile.jpg"
        alt="프로필 이미지"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex flex-col flex-1">
        <div className="text-lg font-semibold text-black dark:text-white">
          {user?.nickname || '게스트'}
        </div>
        <div className="text-[#63461E] dark:text-[#D4A574] text-sm">{profile?.boxName || '-'}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email || '-'}</div>
      </div>
    </div>
  );
};
