// src/components/Footer.tsx
import { useLocation, Link } from 'react-router';
import { navRoutes } from '@/constants/routes';


export default function Footer() {
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 w-full bg-gray-50 border-t border-gray-200 z-50">
      <div className="max-w-[375px] mx-auto flex justify-around items-center py-2">
        {navRoutes.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          const iconSrc = `/icons/${icon}${isActive ? '-active' : ''}.svg`;

          return (
            <Link key={path} to={path} className="flex flex-col items-center text-xs text-black">
              <img src={iconSrc} alt={`${label} 아이콘`} className="w-6 h-6 mb-1" />
              <span className={isActive ? 'font-semibold' : 'text-gray-700'}>{label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
