import { Link } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClassCard } from '@/components/cards/ClassCard';
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
  const [classes, setClasses] = useLocalStorage<SavedClass[]>('admin_classes', []);
  const [reservations, setReservations] = useLocalStorage<ReservedWod[]>('reserved_wods', []);

  const todayClasses = useMemo(() => {
    const today = getToday();
    return classes.filter((c) => c.date === today);
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
      <PageHeader title="오늘의 수업" />

      {todayClasses.length === 0 ? (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-3">오늘 등록된 수업이 없습니다.</p>
          <div className="flex flex-col gap-2">
            <Link to="/admin" className="px-4 h-9 rounded-lg bg-[#63461E] text-white">
              WOD 등록하기
            </Link>
            <Link to="/admin/class" className="px-4 h-9 rounded-lg bg-[#63461E] text-white">
              수업 등록하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
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
    </PageContainer>
  );
}
