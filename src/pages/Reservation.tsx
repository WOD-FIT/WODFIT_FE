import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Calendar } from '@/components/interactive/Calendar';
import { PageContainer } from '@/components/layout/PageContainer';
import { getToday, formatDisplayDate } from '@/utils/date';

type SavedClass = {
  id: string;
  date: string;
  time: string;
  location: string;
  wodId: string;
  capacity: number;
};

type SavedWod = { id: string; date: string; title: string; description: string };
type ReservedWod = { wodId: string; date: string; userId?: string; userNickname?: string };

export default function Reservation() {
  const [searchParams] = useSearchParams();
  const [savedWods] = useLocalStorage<SavedWod[]>('wod_admin_saved', []);
  const [classes] = useLocalStorage<SavedClass[]>('admin_classes', []);
  const [reservedWods, setReservedWods] = useLocalStorage<ReservedWod[]>('reserved_wods', []);
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    // URL 파라미터에서 날짜 가져오기
    const dateParam = searchParams.get('date');
    return dateParam || getToday();
  });

  useEffect(() => {
    // URL 파라미터에서 날짜 가져와서 설정
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
    }
  }, [searchParams]);

  // 관리자는 예약할 수 없도록 체크
  const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
  if (currentUser.role === 'coach') {
    return (
      <PageContainer>
        <h2 className="text-xl font-bold">수업 예약</h2>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">관리자는 예약할 수 없습니다.</p>
          <p className="text-xs text-gray-500 mt-1">예약자 보기는 관리자 페이지에서 확인하세요.</p>
        </div>
      </PageContainer>
    );
  }

  // 해당 날짜의 수업 목록
  const dateClasses = useMemo(() => {
    if (!selectedDate) return [];
    return classes.filter((c) => c.date === selectedDate);
  }, [classes, selectedDate]);

  const markedDates = useMemo(() => {
    return classes.map((c) => c.date);
  }, [classes]);

  const getWodInfo = useMemo(() => {
    return (wodId: string) => {
      return savedWods.find((w) => w.id === wodId);
    };
  }, [savedWods]);

  const reserveWod = (wodId: string) => {
    if (!confirm('이 수업을 예약하시겠습니까?')) return;
    if (!selectedDate) return;
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const newReserved = {
      wodId,
      date: selectedDate,
      userId: currentUser.email,
      userNickname: currentUser.nickname || '닉네임 없음',
    };
    const next = [...reservedWods, newReserved];
    setReservedWods(next);
    alert('예약이 완료되었습니다!');
  };

  const cancelReservation = (wodId: string) => {
    if (!confirm('예약을 취소하시겠습니까?')) return;

    // 현재 날짜와 사용자 정보로 필터링하여 정확하게 취소
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const next = reservedWods.filter((r) => {
      // 같은 WOD ID이지만, 현재 사용자의 예약만 취소
      if (r.wodId !== wodId) return true;
      if (r.userId !== currentUser.email) return true;
      return false;
    });

    setReservedWods(next);

    // 성공 메시지
    alert('예약이 취소되었습니다.');
  };

  return (
    <PageContainer>
      {/* 캘린더 */}
      <div className="mt-4">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={markedDates}
          className="bg-white shadow-sm"
        />
      </div>

      {/* 선택한 날짜의 수업 목록 */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            {selectedDate === getToday()
              ? '오늘의 수업'
              : `${formatDisplayDate(selectedDate)} 수업`}
            <span className="ml-2 text-sm font-normal text-gray-500">({dateClasses.length}개)</span>
          </h3>

          {dateClasses.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div className="mb-2 text-4xl">📭</div>
              <p className="text-sm text-gray-500">해당 날짜에 등록된 수업이 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {dateClasses.map((classItem) => {
                const wodInfo = getWodInfo(classItem.wodId);
                const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
                const isReserved = reservedWods.some(
                  (r) =>
                    r.wodId === classItem.wodId &&
                    r.date === classItem.date &&
                    r.userId === currentUser.email,
                );

                if (!wodInfo) return null;

                return (
                  <div
                    key={classItem.id}
                    className="rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.08)] border border-gray-100 p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">{classItem.date}</div>
                        <div className="mt-1 font-semibold text-[#63461E]">{wodInfo.title}</div>
                        <div className="mt-1 text-sm text-gray-600">
                          {classItem.time} · {classItem.location}
                        </div>
                      </div>
                      {isReserved && (
                        <div className="px-2 py-1 bg-green-50 rounded text-xs text-green-700">
                          예약 완료
                        </div>
                      )}
                    </div>
                    <pre className="whitespace-pre-wrap m-0 mt-2 text-sm text-gray-800">
                      {wodInfo.description}
                    </pre>
                    <div className="mt-4 flex justify-end">
                      {isReserved ? (
                        <button
                          onClick={() => cancelReservation(classItem.wodId)}
                          className="px-4 h-9 rounded-lg border border-red-300 text-red-600"
                        >
                          예약 취소
                        </button>
                      ) : (
                        <button
                          onClick={() => reserveWod(classItem.wodId)}
                          className="px-4 h-9 rounded-lg bg-[#63461E] text-white"
                        >
                          예약하기
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
