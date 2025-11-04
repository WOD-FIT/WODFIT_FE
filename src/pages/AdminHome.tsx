import { Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClassCard } from '@/components/cards/ClassCard';
import { Calendar } from '@/components/interactive/Calendar';
import { PageContainer } from '@/components/layout/PageContainer';
import { getToday, formatDisplayDate } from '@/utils/date';
import type { Class, SavedWod, ReservedWod } from '@/types';

export default function AdminHome() {
  const [savedWods] = useLocalStorage<SavedWod[]>('wod_admin_saved', []);
  const [classes] = useLocalStorage<Class[]>('admin_classes', []);
  const [reservations] = useLocalStorage<ReservedWod[]>('reserved_wods', []);
  const today = getToday();
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  // 컴포넌트 마운트 시 오늘 날짜로 확실히 설정
  useEffect(() => {
    const currentToday = getToday();
    setSelectedDate(currentToday);
  }, []);

  const todayClasses = useMemo(() => {
    if (!selectedDate) return [];
    return classes.filter((c) => c.date === selectedDate);
  }, [classes, selectedDate]);

  const markedDates = useMemo(() => {
    return classes.map((c) => c.date);
  }, [classes]);

  const getWodTitle = useMemo(() => {
    return (wodId: string) => {
      const wod = savedWods.find((w) => w.id === wodId);
      return wod?.title || 'WOD 정보 없음';
    };
  }, [savedWods]);

  const getReservationCount = useMemo(() => {
    return (classId: string, date: string) => {
      return reservations.filter((r) => r.wodId === classId && r.date === date).length;
    };
  }, [reservations]);

  const handleViewReservations = (classItem: Class) => {
    window.location.href = `/admin/class/${classItem.id}`;
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

      {/* 액션 버튼 */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to={selectedDate ? `/admin?date=${selectedDate}` : '/admin'}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#63461E] to-[#8B5A2B] p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="relative z-10">
            <div className="mb-2 text-2xl">💪</div>
            <div className="font-semibold text-white">WOD 등록하기</div>
            <div className="mt-1 text-xs text-white/80">새로운 운동 등록</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Link>

        <Link
          to="/admin/class"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#63461E] to-[#8B5A2B] p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="relative z-10">
            <div className="mb-2 text-2xl">📅</div>
            <div className="font-semibold text-white">수업 등록하기</div>
            <div className="mt-1 text-xs text-white/80">새로운 수업 등록</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Link>
      </div>

      {/* 선택한 날짜의 수업 목록 */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
            {selectedDate === today ? '오늘의 수업' : `${formatDisplayDate(selectedDate)} 수업`}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({todayClasses.length}개)
            </span>
          </h3>

          {todayClasses.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 dark:border-[#404040] bg-gray-50 dark:bg-[#3a3a3a] p-8 text-center">
              <div className="mb-2 text-4xl">📭</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">등록된 수업이 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {todayClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  date={classItem.date}
                  time={classItem.time}
                  location={classItem.location}
                  wodTitle={getWodTitle(classItem.wodId)}
                  capacity={classItem.capacity}
                  reservationCount={getReservationCount(classItem.wodId, classItem.date)}
                  onViewReservations={() => handleViewReservations(classItem)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
