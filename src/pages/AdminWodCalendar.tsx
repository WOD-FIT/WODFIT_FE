import { useState, useMemo } from 'react';
import { Calendar } from '@/components/interactive/Calendar';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDisplayDate } from '@/utils/date';

export default function AdminWodCalendar() {
  const [savedWods] = useLocalStorage<any[]>('wod_admin_saved', []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const markedDates = useMemo(() => {
    return savedWods.map((wod) => wod.date);
  }, [savedWods]);

  const selectedDateWods = useMemo(() => {
    if (!selectedDate) return [];
    return savedWods.filter((wod) => wod.date === selectedDate);
  }, [savedWods, selectedDate]);

  return (
    <PageContainer>
      <PageHeader title="등록된 WOD" subtitle="날짜별로 등록된 WOD를 확인하세요" />

      <div className="mt-4">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={markedDates}
        />

        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              {formatDisplayDate(selectedDate)} 등록된 WOD ({selectedDateWods.length}개)
            </h3>

            {selectedDateWods.length === 0 ? (
              <p className="text-sm text-gray-500">해당 날짜에 등록된 WOD가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedDateWods.map((wod) => (
                  <div key={wod.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-black">{wod.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDisplayDate(wod.date)}
                        </div>
                        <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                          {wod.description}
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-[#63461E] text-white rounded">WOD</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
