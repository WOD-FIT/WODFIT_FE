import { useState, useMemo } from 'react';
import { useWod } from '@/hooks/useWod';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUserStore } from '@/stores/userStore';
import { StatsGrid } from '@/components/interactive/StatsGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { getToday } from '@/utils/date';

type ReservedWod = { wodId: string; date: string; userId: string; userNickname: string };

export default function AdminReservations() {
  const { savedWods } = useWod();
  const [reservations] = useLocalStorage<ReservedWod[]>('reserved_wods', []);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const getUser = useUserStore((state) => state.getUser);

  const getReservationsForDate = useMemo(() => {
    return (date: string) => {
      return reservations.filter((r) => r.date === date);
    };
  }, [reservations]);

  const getWodTitle = useMemo(() => {
    return (wodId: string) => {
      const wod = savedWods.find((w) => w.id === wodId);
      return wod?.title || 'WOD 정보 없음';
    };
  }, [savedWods]);

  const totalReservations = reservations.length;
  const todayReservations = getReservationsForDate(selectedDate);

  // localStorage의 users도 확인 (기존 사용자 지원)
  const getLegacyUser = useMemo(() => {
    return (email: string) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find((u: any) => u.email === email);
      } catch {
        return null;
      }
    };
  }, []);

  const stats = useMemo(
    () => [
      { title: '총 예약 수', value: totalReservations },
      { title: `${selectedDate} 예약 수`, value: todayReservations.length },
    ],
    [totalReservations, todayReservations.length, selectedDate],
  );

  return (
    <PageContainer>
      <PageHeader title="예약자 관리" />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">날짜 선택</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#63461E]"
        />
      </div>

      <StatsGrid stats={stats} className="mt-4" />

      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          {selectedDate} 예약자 ({todayReservations.length}명)
        </h3>

        {todayReservations.length === 0 ? (
          <p className="text-sm text-gray-600">해당 날짜에 예약자가 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {todayReservations.map((reservation, index) => {
              const user = reservation.userId ? getUser(reservation.userId) : null;
              const legacyUser = reservation.userId ? getLegacyUser(reservation.userId) : null;
              const displayNickname =
                user?.nickname ||
                legacyUser?.nickname ||
                reservation.userNickname ||
                reservation.userId ||
                '닉네임 없음';
              const displayEmail = reservation.userId || '이메일 없음';

              return (
                <li key={index} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/profile.jpg"
                      alt="프로필 이미지"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">{displayNickname}</div>
                      <div className="text-xs text-gray-600">{displayEmail}</div>
                    </div>
                    <div className="text-sm text-gray-700">{getWodTitle(reservation.wodId)}</div>
                  </div>
                  <div className="text-xs text-gray-500">{reservation.date}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
