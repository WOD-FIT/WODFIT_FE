import { useEffect, useState } from 'react';

type SavedWod = { id: string; date: string; title: string; description: string };
type ReservedWod = { wodId: string; date: string; userId?: string; userNickname?: string };

export default function Reservation() {
  const [wods, setWods] = useState<SavedWod[]>([]);
  const [reservedWods, setReservedWods] = useState<ReservedWod[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const wodList = JSON.parse(localStorage.getItem('wod_admin_saved') || '[]');
    const reservedList = JSON.parse(localStorage.getItem('reserved_wods') || '[]');
    setWods(wodList);
    setReservedWods(reservedList);
  }, []);

  // 관리자는 예약할 수 없도록 체크
  const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
  if (currentUser.role === 'coach') {
    return (
      <div className="px-4 py-4 w-full">
        <h2 className="text-xl font-bold">WOD 예약</h2>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">관리자는 예약할 수 없습니다.</p>
          <p className="text-xs text-gray-500 mt-1">예약자 보기는 관리자 페이지에서 확인하세요.</p>
        </div>
      </div>
    );
  }

  const reserveWod = (wodId: string) => {
    if (!confirm('이 WOD를 예약하시겠습니까?')) return;
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const newReserved = {
      wodId,
      date,
      userId: currentUser.email,
      userNickname: currentUser.nickname || '닉네임 없음',
    };
    const next = [...reservedWods, newReserved];
    setReservedWods(next);
    localStorage.setItem('reserved_wods', JSON.stringify(next));
  };

  const cancelReservation = (wodId: string) => {
    if (!confirm('예약을 취소하시겠습니까?')) return;

    // 현재 날짜와 사용자 정보로 필터링하여 정확하게 취소
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const next = reservedWods.filter((r) => {
      // 같은 WOD ID이지만, 현재 사용자의 예약만 취소
      if (r.wodId !== wodId) return true;
      if (r.userId !== currentUser.email) return true;
      return false;
    });

    setReservedWods(next);
    localStorage.setItem('reserved_wods', JSON.stringify(next));

    // 성공 메시지
    alert('예약이 취소되었습니다.');
  };

  const list = wods.filter((w) => w.date === date);

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">WOD 예약</h2>
      <div className="mt-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <div className="mt-4">
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">해당 날짜에 등록된 WOD가 없습니다.</p>
        ) : (
          <ul className="grid gap-3">
            {list.map((wod) => {
              const isReserved = reservedWods.some((r) => r.wodId === wod.id);
              return (
                <li key={wod.id} className="border rounded-lg p-4">
                  <div className="text-xs text-gray-500">{wod.date}</div>
                  <div className="mt-1 font-semibold text-[#63461E]">{wod.title}</div>
                  <pre className="whitespace-pre-wrap m-0 mt-2 text-sm text-gray-800">
                    {wod.description}
                  </pre>
                  <div className="mt-3 flex justify-end">
                    {isReserved ? (
                      <button
                        onClick={() => cancelReservation(wod.id)}
                        className="px-4 h-9 rounded-lg border border-red-300 text-red-600"
                      >
                        예약 취소
                      </button>
                    ) : (
                      <button
                        onClick={() => reserveWod(wod.id)}
                        className="px-4 h-9 rounded-lg bg-[#63461E] text-white"
                      >
                        예약하기
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
