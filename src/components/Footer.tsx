import { useLocation, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

type NavRoute = {
  label: string;
  path: string;
  icon: string;
};

export default function Footer() {
  const location = useLocation();
  const { user } = useAuth();

  const dynamicRoutes = useMemo((): NavRoute[] => {
    if (user?.role === 'coach') {
      return [
        { label: '홈', path: '/admin/home', icon: 'home' },
        { label: 'WOD 등록', path: '/admin', icon: 'record' },
        { label: '수업 등록', path: '/admin/class', icon: 'calendar' },
        { label: 'My', path: '/admin/my', icon: 'my' },
      ];
    }
    return [
      { label: '홈', path: '/', icon: 'home' },
      { label: 'WOD 기록', path: '/record', icon: 'record' },
      { label: '수업 예약', path: '/reservation', icon: 'calendar' },
      { label: 'MY', path: '/my', icon: 'my' },
    ];
  }, [user?.role]);

  return (
    <footer className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="w-full flex justify-around items-center py-3 px-2">
        {dynamicRoutes.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          const iconSrc = `/icons/${icon}${isActive ? '-active' : ''}.svg`;

          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center justify-center flex-1 text-xs transition-colors"
            >
              <img
                src={iconSrc}
                alt={`${label} 아이콘`}
                className={`w-6 h-6 mb-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}
              />
              <span
                className={`text-[10px] ${
                  isActive ? 'font-semibold text-[#63461E]' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
