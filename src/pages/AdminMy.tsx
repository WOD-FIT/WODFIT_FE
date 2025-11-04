import { Link } from 'react-router';
import { UserCard } from '@/components/cards/UserCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type User = {
  email: string;
  nickname: string;
  role: 'member' | 'coach';
};

export default function AdminMy() {
  const [allUsers] = useLocalStorage<User[]>('users', []);
  const [classes] = useLocalStorage<any[]>('admin_classes', []);
  const [reservations] = useLocalStorage<any[]>('reserved_wods', []);
  const [savedWods] = useLocalStorage<any[]>('wod_admin_saved', []);

  const memberStats = useMemo(() => {
    const members = allUsers.filter((u) => u.role === 'member');
    const totalClasses = classes.length;
    const totalReservations = reservations.length;
    const totalWods = savedWods.length;

    return [
      { title: '총 회원 수', value: members.length },
      { title: '등록된 WOD', value: totalWods },
      { title: '등록된 수업', value: totalClasses },
      { title: '총 예약 수', value: totalReservations },
    ];
  }, [allUsers, classes, reservations, savedWods]);

  const recentMembers = useMemo(() => {
    return allUsers.filter((u) => u.role === 'member').slice(0, 5);
  }, [allUsers]);

  return (
    <PageContainer>
      <UserCard />

      {/* 관리자 대시보드 */}
      <SectionHeader title="관리자 대시보드" subtitle="전체 현황을 한눈에 확인하세요" />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/admin/wod-calendar" className="block">
          <div className="bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded-lg p-3 text-center hover:bg-[#5a3d1a] dark:hover:bg-[#A67C52] transition-colors cursor-pointer">
            <div className="text-lg font-bold">{memberStats[1].value}</div>
            <div className="text-xs">{memberStats[1].title}</div>
          </div>
        </Link>
        <Link to="/admin/class-calendar" className="block">
          <div className="bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded-lg p-3 text-center hover:bg-[#5a3d1a] dark:hover:bg-[#A67C52] transition-colors cursor-pointer">
            <div className="text-lg font-bold">{memberStats[2].value}</div>
            <div className="text-xs">{memberStats[2].title}</div>
          </div>
        </Link>
        <Link to="/admin/members" className="block">
          <div className="bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded-lg p-3 text-center hover:bg-[#5a3d1a] dark:hover:bg-[#A67C52] transition-colors cursor-pointer">
            <div className="text-lg font-bold">{memberStats[0].value}</div>
            <div className="text-xs">{memberStats[0].title}</div>
          </div>
        </Link>
        <div className="bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded-lg p-3 text-center">
          <div className="text-lg font-bold">{memberStats[3].value}</div>
          <div className="text-xs">{memberStats[3].title}</div>
        </div>
      </div>

      {/* 최근 가입 회원 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">최근 가입 회원</h3>
        {recentMembers.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">가입한 회원이 없습니다.</p>
        ) : (
          <div className="grid gap-2">
            {recentMembers.map((member, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-[#404040] rounded-lg p-3 bg-white dark:bg-[#2d2d2d] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/icons/profile.jpg"
                    alt="프로필 이미지"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-black dark:text-white">{member.nickname}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{member.email}</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                    회원
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
