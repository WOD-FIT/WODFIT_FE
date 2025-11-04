import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useWod } from '@/hooks/useWod';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMemo } from 'react';
import { getToday } from '@/utils/date';

type ReservedWod = { wodId: string; date: string; userId?: string; userNickname?: string };

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { savedWods } = useWod();
  const [reservedWods] = useLocalStorage<ReservedWod[]>('reserved_wods', []);

  const todayWod = useMemo(() => {
    const today = getToday();
    const reservedWodIds = reservedWods.map((r) => r.wodId);
    const reservedWodsList = savedWods.filter((w) => reservedWodIds.includes(w.id));
    return reservedWodsList.find((w) => w.date === today) || reservedWodsList[0];
  }, [savedWods, reservedWods]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">오늘의 WOD</h2>
      {!todayWod ? (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-3">예약한 WOD가 없습니다.</p>
          <button
            onClick={() => (window.location.href = '/reservation')}
            className="px-4 h-9 rounded-lg bg-[#63461E] text-white"
          >
            예약하러 가기
          </button>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.08)] border border-gray-100 p-4 bg-white">
          <div className="text-xs text-gray-500">{todayWod.date}</div>
          <div className="mt-1 font-semibold text-[#63461E]">{todayWod.title}</div>
          <pre className="whitespace-pre-wrap m-0 mt-1 text-sm text-gray-800">
            {todayWod.description}
          </pre>
          <div className="mt-4 flex flex-col gap-2">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-700">✅ 예약 완료</p>
            </div>
            <button
              onClick={() => {
                // 수업 완료 후 작성 모드로 이동 - 수업 WOD 내용을 전달
                const classWodData = {
                  id: todayWod.id,
                  title: todayWod.title,
                  description: todayWod.description,
                };
                console.log('수업 WOD 데이터 저장:', classWodData);
                localStorage.setItem('class_wod_write', JSON.stringify(classWodData));
                window.location.href = '/record?mode=class';
              }}
              className="w-full px-4 h-9 rounded-lg bg-[#63461E] text-white font-medium"
            >
              작성하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
