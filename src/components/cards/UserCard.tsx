import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from 'react-router';

type UserCardProps = {
  showLogout?: boolean;
  onLogout?: () => void;
};

type Profile = {
  boxName?: string;
};

export const UserCard = ({ showLogout = true, onLogout }: UserCardProps) => {
  const { user, logout } = useAuth();
  const [profile] = useLocalStorage<Profile>('member_profile', {});

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src="/icons/profile.jpg"
        alt="프로필 이미지"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex flex-col flex-1">
        <div className="text-lg font-semibold text-black">{user?.nickname || '게스트'}</div>
        <div className="text-[#63461E] text-sm">{profile?.boxName || '-'}</div>
        <div className="text-sm text-gray-500">{user?.email || '-'}</div>
        <Link to="/member/profile" className="mt-2 text-xs text-[#63461E] underline">
          프로필 수정
        </Link>
      </div>
      {showLogout && (
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg whitespace-nowrap"
        >
          로그아웃
        </button>
      )}
    </div>
  );
};
