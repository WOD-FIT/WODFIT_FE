import { useNavigate } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCallback } from 'react';

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [notif, setNotif] = useLocalStorage('pref_notif', true);
  const [notifTime, setNotifTime] = useLocalStorage('pref_notif_time', '08:00');

  const handleSave = useCallback(() => {
    alert('알림 설정이 저장되었습니다.');
    navigate('/settings');
  }, [navigate]);

  return (
    <PageContainer>
      <PageHeader title="알림 설정" />
      <div className="mt-4 space-y-6">
        <div className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">알림 받기</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  매일 운동 알림을 받습니다
                </div>
              </div>
              <button
                onClick={() => setNotif(!notif)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574] focus:ring-offset-2 ${
                  notif ? 'bg-[#63461E] dark:bg-[#8B5A2B]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notif ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {notif && (
          <div className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden">
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                알림 시간
              </label>
              <input
                type="time"
                value={notifTime}
                onChange={(e) => setNotifTime(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full h-11 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white font-medium hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
        >
          저장하기
        </button>
      </div>
    </PageContainer>
  );
}
