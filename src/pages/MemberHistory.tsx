import { useState, useMemo } from 'react';
import { useWod } from '@/hooks/useWod';
import { Calendar } from '@/components/interactive/Calendar';
import { WodCard } from '@/components/cards/WodCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCallback } from 'react';
import { formatDisplayDate } from '@/utils/date';

export default function MemberHistory() {
  const { wods, deleteWod } = useWod();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const markedDates = useMemo(() => {
    return wods.map((wod) => wod.date);
  }, [wods]);

  const selectedDateWods = useMemo(() => {
    if (!selectedDate) return [];
    return wods.filter((wod) => wod.date === selectedDate);
  }, [wods, selectedDate]);

  const filteredWods = useMemo(() => {
    if (!searchTerm) return selectedDateWods;
    return selectedDateWods.filter((wod) =>
      wod.text.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [selectedDateWods, searchTerm]);

  const handleDeleteWod = useCallback(
    (wodId: string) => {
      if (!confirm('이 WOD를 삭제하시겠습니까?')) return;
      deleteWod(wodId);
    },
    [deleteWod],
  );

  const handleEditWod = useCallback((wodId: string) => {
    localStorage.setItem('edit_wod', wodId);
    window.location.href = '/record';
  }, []);

  return (
    <PageContainer>
      <PageHeader title="WOD 기록 관리" />

      <div className="mt-4">
        <input
          type="text"
          placeholder="WOD 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={markedDates}
        />

        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              {formatDisplayDate(selectedDate)} WOD 기록 ({filteredWods.length}개)
            </h3>

            {filteredWods.length === 0 ? (
              <p className="text-sm text-gray-500">해당 날짜에 WOD 기록이 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredWods.map((wod) => (
                  <WodCard
                    key={wod.id}
                    date={wod.date}
                    text={wod.text}
                    tags={wod.tags}
                    time={wod.time}
                    showActions
                    onEdit={() => handleEditWod(wod.id)}
                    onDelete={() => handleDeleteWod(wod.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
