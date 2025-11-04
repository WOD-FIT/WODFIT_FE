import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer } from '@/components/layout/PageContainer';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export default function Settings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notif] = useLocalStorage('pref_notif', true);
  const [notifTime] = useLocalStorage('pref_notif_time', '08:00');

  const deleteAccount = useCallback(() => {
    if (!confirm('정말로 계정을 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return;

    if (!user) return;

    const usersRaw = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersRaw);
    const filteredUsers = users.filter((u: any) => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    // 사용자별 프로필 삭제
    if (user?.email) {
      localStorage.removeItem(`member_profile_${user.email}`);
    }
    localStorage.removeItem('member_profile'); // 기존 공용 프로필도 삭제
    localStorage.removeItem('wods');
    localStorage.removeItem('reserved_wods');

    alert('계정이 삭제되었습니다.');
    logout();
  }, [user, logout]);

  return (
    <PageContainer>
      <div className="mt-4 space-y-4">
        {/* 프로필 섹션 */}
        <div className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden">
          <div
            onClick={() => navigate('/member/profile')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#63461E] dark:bg-[#8B5A2B] flex items-center justify-center text-white font-semibold text-lg">
                {user?.nickname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user?.nickname || '닉네임 없음'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">회원입니다</div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 설정 옵션들 */}
        <div className="space-y-3">
          {/* 다크모드 */}
          <div className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#63461E]/10 dark:bg-[#8B5A2B]/20 flex items-center justify-center">
                  {isDark ? (
                    <svg
                      className="w-5 h-5 text-[#63461E] dark:text-[#D4A574]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#63461E]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">다크 모드</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isDark ? '어두운 테마' : '밝은 테마'}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574] focus:ring-offset-2 ${
                  isDark ? 'bg-[#63461E] dark:bg-[#8B5A2B]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 알림 설정 */}
          <div
            onClick={() => navigate('/settings/notification')}
            className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#63461E]/10 dark:bg-[#8B5A2B]/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#63461E] dark:text-[#D4A574]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">알림 설정</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {notif ? `매일 ${notifTime}에 알림` : '알림 끄기'}
                  </div>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 계정 관리 */}
        <div className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-[#404040] flex items-center justify-between">
            <div className="font-semibold text-gray-900 dark:text-white">계정 관리</div>
            <button
              onClick={() => navigate('/settings/password')}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#63461E] dark:hover:text-[#D4A574] transition-colors"
            >
              비밀번호 변경하기
            </button>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={logout}
              className="w-full px-4 h-11 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-[#4a4a4a] transition-colors"
            >
              로그아웃
            </button>
            <button
              onClick={deleteAccount}
              className="w-full px-4 h-11 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              계정 탈퇴
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
