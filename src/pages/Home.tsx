import { Navigate } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer } from '@/components/layout/PageContainer';
import { useMemo } from 'react';
import { getToday, formatDisplayDate } from '@/utils/date';

type SavedClass = {
  id: string;
  date: string;
  time: string;
  location: string;
  wodId: string;
  capacity: number;
};

type SavedWod = {
  id: string;
  date: string;
  title: string;
  description: string;
};

type ReservedWod = { wodId: string; date: string; userId?: string; userNickname?: string };

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const today = getToday();
  const [savedWods] = useLocalStorage<SavedWod[]>('wod_admin_saved', []);
  const [classes] = useLocalStorage<SavedClass[]>('admin_classes', []);
  const [reservedWods] = useLocalStorage<ReservedWod[]>('reserved_wods', []);

  // 오늘 예약한 수업 목록
  const todayReservedClasses = useMemo(() => {
    if (!user) return [];

    // 오늘 날짜의 예약 찾기 (userId로 필터링)
    const todayReservations = reservedWods.filter(
      (r) => r.date === today && r.userId === user.email,
    );

    if (todayReservations.length === 0) return [];

    // 예약된 WOD ID 목록
    const reservedWodIds = new Set(todayReservations.map((r) => r.wodId));

    // 오늘 날짜의 수업 중 예약된 수업 필터링
    const filtered = classes.filter((classItem) => {
      const isToday = classItem.date === today;
      const isReserved = reservedWodIds.has(classItem.wodId);
      return isToday && isReserved;
    });

    return filtered;
  }, [classes, reservedWods, user, today]);

  // 오늘 등록된 모든 수업의 WOD 목록 (중복 제거)
  const todayWods = useMemo(() => {
    const todayClasses = classes.filter((c) => c.date === today);
    const wodIds = [...new Set(todayClasses.map((c) => c.wodId))];
    return wodIds
      .map((wodId) => savedWods.find((w) => w.id === wodId))
      .filter((wod) => wod !== undefined) as SavedWod[];
  }, [classes, savedWods, today]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <PageContainer>
      {/* 오늘의 수업 */}
      <div className="mt-4">
        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">오늘의 수업</h3>

        {todayReservedClasses.length > 0 ? (
          <div className="grid gap-3">
            {todayReservedClasses.map((classItem) => {
              const wodInfo = savedWods.find((w) => w.id === classItem.wodId);

              return (
                <div
                  key={classItem.id}
                  className="rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-[#404040] p-4 bg-white dark:bg-[#2d2d2d] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDisplayDate(classItem.date)}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {classItem.time} · {classItem.location}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        정원: {classItem.capacity}명
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-400">
                      예약 완료
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // 수업 완료 후 작성 모드로 이동 - 수업 WOD 내용을 전달
                      if (wodInfo) {
                        const classWodData = {
                          id: classItem.wodId,
                          title: wodInfo.title,
                          description: wodInfo.description,
                        };
                        localStorage.setItem('class_wod_write', JSON.stringify(classWodData));
                        window.location.href = '/record?mode=class';
                      }
                    }}
                    className="w-full px-4 h-9 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white font-medium hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
                  >
                    작성하기
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-200 dark:border-[#404040] bg-gray-50 dark:bg-[#3a3a3a] p-8 text-center">
            <div className="mb-2 text-4xl">📭</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">예약한 수업이 없습니다!</p>
            <button
              onClick={() => {
                navigate(`/reservation?date=${today}`);
              }}
              className="flex items-center justify-center w-[150px] mx-auto px-4 h-9 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white text-sm mt-4 hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
            >
              예약하러 가기
            </button>
          </div>
        )}
      </div>

      {/* 오늘의 WOD */}
      {todayWods.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">오늘의 WOD</h3>
          <div className="grid gap-3">
            {todayWods.map((wod) => (
              <div
                key={wod.id}
                className="rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-[#404040] p-4 bg-white dark:bg-[#2d2d2d] transition-colors"
              >
                <div className="font-semibold text-[#63461E] dark:text-[#D4A574] mb-2">
                  {wod.title}
                </div>
                <pre className="whitespace-pre-wrap m-0 text-sm text-gray-800 dark:text-gray-200">
                  {wod.description}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
