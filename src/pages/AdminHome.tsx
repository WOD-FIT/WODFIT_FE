import { Link } from 'react-router';
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClassCard } from '@/components/cards/ClassCard';
import { Calendar } from '@/components/interactive/Calendar';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMemo } from 'react';
import { getToday } from '@/utils/date';

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

export default function AdminHome() {
  const [savedWods] = useLocalStorage<SavedWod[]>('wod_admin_saved', []);
  const [classes] = useLocalStorage<SavedClass[]>('admin_classes', []);
  const [reservations] = useLocalStorage<ReservedWod[]>('reserved_wods', []);
  const [selectedDate, setSelectedDate] = useState<string | null>(getToday());

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

  const handleViewReservations = (classItem: SavedClass) => {
    window.location.href = `/admin/class/${classItem.id}`;
  };

  return (
    <PageContainer>
      <PageHeader title="관리자 홈" />

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
          to="/admin"
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
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            {selectedDate === getToday() ? '오늘의 수업' : `${selectedDate} 수업`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({todayClasses.length}개)
            </span>
          </h3>

          {todayClasses.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div className="mb-2 text-4xl">📭</div>
              <p className="text-sm text-gray-500">등록된 수업이 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {todayClasses.map((classItem) => {
                const wodTitle = getWodTitle(classItem.wodId);
                const reservationCount = getReservationCount(classItem.wodId, classItem.date);

                return (
                  <ClassCard
                    key={classItem.id}
                    date={classItem.date}
                    time={classItem.time}
                    location={classItem.location}
                    wodTitle={wodTitle}
                    capacity={classItem.capacity}
                    reservationCount={reservationCount}
                    onViewReservations={() => handleViewReservations(classItem)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
