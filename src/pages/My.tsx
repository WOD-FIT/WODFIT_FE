import { useSearchParams, Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useWod } from '@/hooks/useWod';
import { UserCard } from '@/components/cards/UserCard';
import { WodCard } from '@/components/cards/WodCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { Calendar } from '@/components/interactive/Calendar';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { formatDisplayDate, getToday } from '@/utils/date';

export default function My() {
  const { user } = useAuth();
  const { wods, deleteWod } = useWod();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'records' | 'manage'>(
    tabParam === 'manage' ? 'manage' : 'records',
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 페이지 마운트 시 한 번만 실행
  useEffect(() => {
    const savedWods = JSON.parse(localStorage.getItem('wods') || '[]');
    console.log('My 페이지 마운트 - localStorage WOD 개수:', savedWods.length);
    console.log('My 페이지 마운트 - Context WOD 개수:', wods.length);
  }, []); // 빈 배열로 마운트 시 한 번만 실행

  // 최신 WOD 날짜 계산 (메모이제이션)
  const latestWodDate = useMemo(() => {
    if (wods.length === 0) return null;
    const sortedWods = [...wods].sort((a, b) => (b.date > a.date ? 1 : -1));
    return sortedWods[0].date;
  }, [wods]);

  // 기록 관리 탭에서 날짜 자동 선택 로직
  useEffect(() => {
    if (activeTab === 'manage') {
      if (wods.length === 0) {
        // WOD가 없으면 selectedDate를 null로 유지
        if (selectedDate !== null) {
          setSelectedDate(null);
        }
        return;
      }

      // 오늘 날짜에 WOD가 있으면 오늘 날짜 우선 선택
      const today = getToday();
      const hasTodayWod = wods.some((wod) => wod.date === today);

      if (hasTodayWod) {
        if (selectedDate !== today) {
          setSelectedDate(today);
        }
        return;
      }

      // selectedDate가 null이거나 해당 날짜에 WOD가 없으면 최신 WOD 날짜 선택
      if (!selectedDate || !wods.some((wod) => wod.date === selectedDate)) {
        if (latestWodDate && selectedDate !== latestWodDate) {
          setSelectedDate(latestWodDate);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, wods.length, latestWodDate]);

  // URL 파라미터가 변경되면 탭도 업데이트
  useEffect(() => {
    if (tabParam === 'manage') {
      setActiveTab('manage');
    } else if (tabParam === 'records') {
      setActiveTab('records');
    }
  }, [tabParam]);

  const handleDeleteWod = useCallback(
    (wodId: string) => {
      if (!confirm('이 WOD를 삭제하시겠습니까?')) return;
      deleteWod(wodId);
    },
    [deleteWod],
  );

  const handleEditWod = useCallback((wodId: string) => {
    // 편집 모드로 진입: ID를 문자열로 저장 (Record.tsx에서 처리)
    localStorage.setItem('edit_wod', wodId);
    window.location.href = '/record';
  }, []);

  // 기록 관리 탭용 필터링
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

  const handleTabChange = (tab: 'records' | 'manage') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // 코치는 /admin/my로 리다이렉트
  if (user?.role === 'coach') {
    return <Navigate to="/admin/my" replace />;
  }

  return (
    <PageContainer>
      <UserCard />

      {/* 탭바 */}
      <div className="mt-4 flex border-b border-gray-200 dark:border-[#404040]">
        <button
          onClick={() => handleTabChange('records')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'records'
              ? 'border-b-2 border-[#63461E] text-[#63461E] dark:text-[#D4A574]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          나의 WOD 기록
        </button>
        <button
          onClick={() => handleTabChange('manage')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'manage'
              ? 'border-b-2 border-[#63461E] text-[#63461E] dark:text-[#D4A574]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          기록 관리
        </button>
      </div>

      {/* 나의 WOD 기록 탭 */}
      {activeTab === 'records' && (
        <div className="mt-4">
          {wods.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              아직 WOD 기록이 없습니다. 기록을 추가해보세요.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {wods.map((wod, index) => {
                // 홀수번째(1, 3, 5...): #Interval, #Run
                // 짝수번째(2, 4, 6...): #Metcon, #Barbell
                // index는 0부터 시작하므로 1을 더해서 계산
                const wodIndex = index + 1;
                const autoTags =
                  wodIndex % 2 === 1
                    ? ['Interval', 'Run'] // 홀수번째
                    : ['Metcon', 'Barbell']; // 짝수번째

                // 기존 tags가 있으면 사용, 없으면 자동 태그 사용
                const displayTags = wod.tags && wod.tags.length > 0 ? wod.tags : autoTags;

                return (
                  <WodCard
                    key={wod.id}
                    date={wod.date}
                    text={wod.text}
                    tags={displayTags}
                    time={wod.time}
                    showActions
                    onEdit={() => handleEditWod(wod.id)}
                    onDelete={() => handleDeleteWod(wod.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 기록 관리 탭 */}
      {activeTab === 'manage' && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="WOD 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 mb-4 bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
          />

          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            markedDates={markedDates}
            className="bg-white dark:bg-[#2d2d2d] shadow-sm"
          />

          {selectedDate && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                {formatDisplayDate(selectedDate)} WOD 기록 ({filteredWods.length}개)
              </h3>

              {filteredWods.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  해당 날짜에 WOD 기록이 없습니다.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredWods.map((wod, index) => {
                    // 홀수번째(1, 3, 5...): #Interval, #Run
                    // 짝수번째(2, 4, 6...): #Metcon, #Barbell
                    const wodIndex = index + 1;
                    const autoTags =
                      wodIndex % 2 === 1
                        ? ['Interval', 'Run'] // 홀수번째
                        : ['Metcon', 'Barbell']; // 짝수번째

                    const displayTags = wod.tags && wod.tags.length > 0 ? wod.tags : autoTags;

                    return (
                      <WodCard
                        key={wod.id}
                        date={wod.date}
                        text={wod.text}
                        tags={displayTags}
                        time={wod.time}
                        showActions
                        onEdit={() => handleEditWod(wod.id)}
                        onDelete={() => handleDeleteWod(wod.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
