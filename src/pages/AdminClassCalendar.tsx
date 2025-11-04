import { useState, useMemo } from 'react';
import { Calendar } from '@/components/interactive/Calendar';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDisplayDate } from '@/utils/date';

export default function AdminClassCalendar() {
  const [classes] = useLocalStorage<any[]>('admin_classes', []);
  const [savedWods] = useLocalStorage<any[]>('wod_admin_saved', []);
  const [reservations] = useLocalStorage<any[]>('reserved_wods', []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const markedDates = useMemo(() => {
    return classes.map((classItem) => classItem.date);
  }, [classes]);

  const selectedDateClasses = useMemo(() => {
    if (!selectedDate) return [];
    return classes.filter((classItem) => classItem.date === selectedDate);
  }, [classes, selectedDate]);

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

  return (
    <PageContainer>
      <PageHeader title="등록된 수업" subtitle="날짜별로 등록된 수업을 확인하세요" />

      <div className="mt-4">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={markedDates}
        />

        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              {formatDisplayDate(selectedDate)} 등록된 수업 ({selectedDateClasses.length}개)
            </h3>

            {selectedDateClasses.length === 0 ? (
              <p className="text-sm text-gray-500">해당 날짜에 등록된 수업이 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedDateClasses.map((classItem) => {
                  const wodTitle = getWodTitle(classItem.wodId);
                  const reservationCount = getReservationCount(classItem.wodId, classItem.date);

                  return (
                    <div key={classItem.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-black">
                            {classItem.time} - {classItem.location}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">WOD: {wodTitle}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDisplayDate(classItem.date)}
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            정원: {classItem.capacity}명 | 예약: {reservationCount}명
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-blue-500 text-white rounded">수업</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
