import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export default function Header() {
  const { user } = useAuth();
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllReadForUser = useNotificationStore((state) => state.markAllReadForUser);
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const role = user?.role || 'member';
  const userId = user?.email || '';

  const roleDisplay = useMemo(() => {
    if (!user?.role) return null;
    return user.role === 'coach' ? 'Coach' : 'Member';
  }, [user?.role]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => n.target === role);
  }, [notifications, role]);

  const hasUnreadForRole = useMemo(() => {
    if (!userId) return false;
    return visibleNotifications.some((n) => !(n.readBy || []).includes(userId));
  }, [visibleNotifications, userId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleNotification = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!prev && userId) {
        markAllReadForUser(role as 'member' | 'coach', userId);
      }
      return next;
    });
  };

  return (
    <header className="w-full mx-auto flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-[#555555] bg-white dark:bg-[#2d2d2d] transition-colors">
      {/* Left: Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/" aria-label="홈으로 이동">
          <img
            src="/icons/Logo.svg"
            alt="WOD 로고"
            className="dark:brightness-0 dark:invert dark:opacity-100 transition-all"
          />
        </Link>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        {roleDisplay && (
          <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-[#555555] text-gray-700 dark:text-white bg-gray-50 dark:bg-[#3a3a3a] transition-colors">
            {roleDisplay}
          </span>
        )}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={handleToggleNotification}
            className="relative"
            aria-label="알림 열기"
          >
            <img
              src="/icons/notice.svg"
              alt="알림 아이콘"
              className="w-5 h-5 dark:brightness-0 dark:invert dark:opacity-100 transition-all cursor-pointer hover:opacity-70 dark:hover:opacity-90"
            />
            {hasUnreadForRole && (
              <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 dark:border-[#555555] bg-white dark:bg-[#2d2d2d] shadow-lg overflow-hidden z-50">
              <div className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-[#555555]">
                알림
              </div>
              <div className="max-h-80 overflow-y-auto">
                {visibleNotifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    새로운 알림이 없습니다.
                  </div>
                ) : (
                  visibleNotifications.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link || '/reservation'}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                        {item.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <Link to="/settings" aria-label="설정 페이지로 이동">
          <img
            src="/icons/setting.svg"
            alt="설정 아이콘"
            className="w-5 h-5 dark:brightness-0 dark:invert dark:opacity-100 transition-all cursor-pointer hover:opacity-70 dark:hover:opacity-90"
          />
        </Link>
      </div>
    </header>
  );
}
