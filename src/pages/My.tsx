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
          {wods.map((wod) => (
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
    </PageContainer>
  );
}
