import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useWod } from '@/hooks/useWod';
import { UserCard } from '@/components/cards/UserCard';
import { WodCard } from '@/components/cards/WodCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { useCallback, useEffect } from 'react';

export default function My() {
  const { user } = useAuth();
  const { wods, deleteWod } = useWod();

  // 페이지 마운트 시 한 번만 실행
  useEffect(() => {
    const savedWods = JSON.parse(localStorage.getItem('wods') || '[]');
    console.log('My 페이지 마운트 - localStorage WOD 개수:', savedWods.length);
    console.log('My 페이지 마운트 - Context WOD 개수:', wods.length);
  }, []); // 빈 배열로 마운트 시 한 번만 실행

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

  return (
    <PageContainer>
      <UserCard />

      <SectionHeader
        title="나의 WOD 기록"
        actions={
          user?.role === 'coach' ? (
            <Link
              to="/admin/my"
              className="text-xs px-3 h-8 inline-flex items-center rounded-lg border"
            >
              관리자 대시보드
            </Link>
          ) : (
            <Link
              to="/member/history"
              className="text-xs px-3 h-8 inline-flex items-center rounded-lg border"
            >
              기록 관리
            </Link>
          )
        }
      />

      {wods.length === 0 ? (
        <p className="text-sm text-gray-500">아직 WOD 기록이 없습니다. 기록을 추가해보세요.</p>
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
    </PageContainer>
  );
}
