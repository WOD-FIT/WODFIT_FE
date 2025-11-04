import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { WodCard } from '@/components/cards/WodCard';

type User = {
  email: string;
  nickname: string;
  role: 'member' | 'coach';
};

type WodEntry = {
  id: string;
  date: string;
  text: string;
  time: { min: string; sec: string };
  exercises: { name: string; weight: string }[];
  tags?: string[];
};

export default function AdminMembers() {
  const [allUsers, setAllUsers] = useLocalStorage<User[]>('users', []);
  const [allWods] = useLocalStorage<WodEntry[]>('wods', []);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const members = useMemo(() => {
    return allUsers.filter((user) => user.role === 'member');
  }, [allUsers]);

  const memberWods = useMemo(() => {
    if (!selectedMember) return [];
    // 회원의 이메일로 WOD를 필터링 (실제로는 사용자 ID로 매칭해야 함)
    return allWods.filter(() => {
      // 임시로 모든 WOD를 표시 (실제로는 사용자별 WOD 분리가 필요)
      return true;
    });
  }, [allWods, selectedMember]);

  const handleMemberSelect = (member: User) => {
    setSelectedMember(member);
  };

  const handleBackToList = () => {
    setSelectedMember(null);
  };

  const handleDeleteMember = (member: User) => {
    if (
      !confirm(
        `${member.nickname}(${member.email}) 회원을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 회원의 모든 데이터가 삭제됩니다.`,
      )
    ) {
      return;
    }

    // 1. users 배열에서 회원 제거
    const updatedUsers = allUsers.filter((user) => user.email !== member.email);
    setAllUsers(updatedUsers);

    // 2. 회원의 프로필 데이터 삭제
    localStorage.removeItem(`member_profile_${member.email}`);

    // 3. 회원의 WOD 데이터 삭제 (wods 배열에서 해당 회원의 WOD 제거)
    // 실제로는 WOD에 userId가 있어야 정확히 필터링 가능하지만, 현재 구조상 모든 WOD를 공유하므로
    // 이 부분은 필요에 따라 수정 필요

    // 4. 예약 데이터에서도 해당 회원 제거
    const reservations = JSON.parse(localStorage.getItem('reserved_wods') || '[]');
    const updatedReservations = reservations.filter((r: any) => r.userId !== member.email);
    localStorage.setItem('reserved_wods', JSON.stringify(updatedReservations));

    alert('회원이 삭제되었습니다.');
  };

  if (selectedMember) {
    return (
      <PageContainer>
        <PageHeader
          title={`${selectedMember.nickname}님의 WOD 기록`}
          actions={
            <button
              onClick={handleBackToList}
              className="text-sm px-3 py-1 bg-gray-500 text-white rounded"
            >
              목록으로
            </button>
          }
        />

        <div className="mt-4">
          <div className="border border-gray-200 dark:border-[#404040] rounded-lg p-4 bg-white dark:bg-[#2d2d2d] mb-4 transition-colors">
            <div className="flex items-center gap-3">
              <img
                src="/icons/profile.jpg"
                alt="프로필 이미지"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-black dark:text-white">
                  {selectedMember.nickname}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMember.email}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">회원</div>
              </div>
            </div>
          </div>

          {memberWods.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              이 회원의 WOD 기록이 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {memberWods.map((wod) => (
                <WodCard
                  key={wod.id}
                  date={wod.date}
                  text={wod.text}
                  tags={wod.tags}
                  time={wod.time}
                />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="회원 목록" subtitle="전체 회원을 관리하고 WOD 기록을 확인하세요" />

      <div className="mt-4">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">가입한 회원이 없습니다.</p>
        ) : (
          <div className="grid gap-3">
            {members.map((member) => (
              <div
                key={member.email}
                className="border border-gray-200 dark:border-[#404040] rounded-lg p-4 bg-white dark:bg-[#2d2d2d] transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/profile.jpg"
                      alt="프로필 이미지"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-black dark:text-white">
                        {member.nickname}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleMemberSelect(member)}
                      className="text-xs px-3 py-1 bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded hover:bg-[#5a3d1a] dark:hover:bg-[#A67C52] transition-colors"
                    >
                      WOD 보기
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="text-xs px-3 py-1 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                    >
                      회원 삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
