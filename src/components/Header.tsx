import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

export default function Header() {
  const { user } = useAuth();

  const roleDisplay = useMemo(() => {
    if (!user?.role) return null;
    return user.role === 'coach' ? 'Coach' : 'Member';
  }, [user?.role]);

  return (
    <header className="w-full mx-auto flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
      {/* Left: Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/" aria-label="홈으로 이동">
          <img src="/icons/Logo.svg" alt="WOD 로고" />
        </Link>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        {roleDisplay && (
          <span className="text-xs px-2 py-1 rounded-full border border-gray-300 text-gray-700">
            {roleDisplay}
          </span>
        )}
        <img src="/icons/notice.svg" alt="알림 아이콘" className="w-5 h-5" />
        <Link to="/settings" aria-label="설정 페이지로 이동">
          <img src="/icons/setting.svg" alt="설정 아이콘" className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
