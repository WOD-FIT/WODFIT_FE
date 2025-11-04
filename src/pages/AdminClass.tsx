import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClassCard } from '@/components/cards/ClassCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { getToday } from '@/utils/date';

type SavedClass = {
  id: string;
  date: string;
  time: string;
  location: string;
  wodId: string;
  capacity: number;
};

type ReservedWod = { wodId: string; date: string; userId?: string; userNickname?: string };

export default function AdminClass() {
  const [savedWods] = useLocalStorage<any[]>('wod_admin_saved', []);
  const [classes, setClasses] = useLocalStorage<SavedClass[]>('admin_classes', []);
  const [reservations] = useLocalStorage<ReservedWod[]>('reserved_wods', []);
  const [formData, setFormData] = useState({
    time: '',
    location: '',
    wodId: '',
    capacity: '',
  });

  const wodOptions = useMemo(() => {
    return savedWods.map((wod) => ({
      id: wod.id,
      title: wod.title,
    }));
  }, [savedWods]);

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

  // WOD 등록 후 수업 등록 페이지로 이동했을 때, 선택된 WOD를 자동으로 설정
  useEffect(() => {
    const selectedWodId = localStorage.getItem('selected_wod_for_class');
    if (selectedWodId) {
      setFormData((prev) => ({ ...prev, wodId: selectedWodId }));
      // 사용 후 제거
      localStorage.removeItem('selected_wod_for_class');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form data:', formData); // 디버깅용 로그

    // 시간 유효성 검사
    if (!formData.time || formData.time.trim() === '') {
      alert('시간을 입력해주세요.');
      return;
    }

    // 시간 형식 검사 (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.time)) {
      alert('올바른 시간 형식을 입력해주세요. (예: 19:30)');
      return;
    }

    if (
      !formData.location ||
      !formData.wodId ||
      !formData.capacity ||
      Number(formData.capacity) <= 0
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newClass: SavedClass = {
      id: crypto.randomUUID(),
      date: getToday(),
      time: formData.time,
      location: formData.location,
      wodId: formData.wodId,
      capacity: Number(formData.capacity),
    };

    console.log('New class:', newClass); // 디버깅용 로그

    setClasses((prev) => {
      const updated = [...prev, newClass];
      console.log('Updated classes:', updated); // 디버깅용 로그
      return updated;
    });

    setFormData({ time: '', location: '', wodId: '', capacity: '' });
    alert('수업이 등록되었습니다.');
  };

  const handleViewReservations = (classItem: SavedClass) => {
    const wod = savedWods.find((w) => w.id === classItem.wodId);
    const classReservations = reservations.filter(
      (r) => r.wodId === classItem.wodId && r.date === classItem.date,
    );

    const reservationList = classReservations
      .map((r) => `- ${r.userNickname || '닉네임 없음'} (${r.userId || '이메일 없음'})`)
      .join('\n');

    alert(
      `수업 정보:\n날짜: ${classItem.date}\n시간: ${classItem.time}\n장소: ${classItem.location}\nWOD: ${wod?.title || 'N/A'}\n정원: ${classItem.capacity}\n예약자 수: ${classReservations.length}명\n\n예약자 목록:\n${reservationList || '예약자가 없습니다.'}`,
    );
  };

  const handleDeleteClass = (classId: string) => {
    if (!confirm('이 수업을 삭제하시겠습니까?')) return;
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  return (
    <PageContainer>
      <PageHeader title="수업 등록" />

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => {
              const timeValue = e.target.value;
              console.log('Time input value:', timeValue); // 디버깅용 로그
              setFormData((prev) => ({ ...prev, time: timeValue }));
            }}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="19:30"
            required
          />
          <p className="text-xs text-gray-500 mt-1">24시간 형식으로 입력하세요 (예: 19:30)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="수업 장소를 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WOD 선택</label>
          <select
            value={formData.wodId}
            onChange={(e) => setFormData((prev) => ({ ...prev, wodId: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">WOD를 선택하세요</option>
            {wodOptions.map((wod) => (
              <option key={wod.id} value={wod.id}>
                {wod.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">정원</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
            min="1"
            required
          />
        </div>

        <button type="submit" className="h-11 rounded-lg bg-[#63461E] text-white">
          수업 등록
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">등록된 수업 목록</h3>
        {classes.length === 0 ? (
          <p className="text-sm text-gray-500">등록된 수업이 없습니다.</p>
        ) : (
          <div className="grid gap-3">
            {classes.map((classItem) => (
              <ClassCard
                key={classItem.id}
                date={classItem.date}
                time={classItem.time}
                location={classItem.location}
                wodTitle={getWodTitle(classItem.wodId)}
                capacity={classItem.capacity}
                reservationCount={getReservationCount(classItem.wodId, classItem.date)}
                onViewReservations={() => handleViewReservations(classItem)}
                onDelete={() => handleDeleteClass(classItem.id)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
