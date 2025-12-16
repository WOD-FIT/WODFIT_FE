import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useClassStore } from '@/stores/classStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useReservationStore } from '@/stores/reservationStore';
import { useWodStore } from '@/stores/wodStore';
import { ClassCard } from '@/components/cards/ClassCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { getToday } from '@/utils/date';
import type { Class } from '@/types';

export default function AdminClass() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'register' | 'list'>(
    tabParam === 'list' ? 'list' : 'register',
  );
  const savedWods = useWodStore((state) => state.savedWods);
  const classes = useClassStore((state) => state.classes);
  const addClass = useClassStore((state) => state.addClass);
  const deleteClass = useClassStore((state) => state.deleteClass);
  const reservations = useReservationStore((state) => state.reservations);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [formData, setFormData] = useState({
    date: getToday(),
    time: '',
    location: '',
    wodId: '',
    capacity: '',
  });

  // URL 파라미터가 변경되면 탭도 업데이트
  useEffect(() => {
    if (tabParam === 'list') {
      setActiveTab('list');
    } else if (tabParam === 'register') {
      setActiveTab('register');
    }
  }, [tabParam]);

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

    const newClass: Omit<Class, 'id'> = {
      date: formData.date,
      time: formData.time,
      location: formData.location,
      wodId: formData.wodId,
      capacity: Number(formData.capacity),
    };

    addClass(newClass);
    const wodTitle = savedWods.find((w) => w.id === formData.wodId)?.title || '수업';
    addNotification({
      message: `새로운 수업 "${wodTitle}"이 등록되었습니다!`,
      link: '/reservation',
      target: 'member',
    });

    setFormData({ date: getToday(), time: '', location: '', wodId: '', capacity: '' });
    setActiveTab('list');
    setSearchParams({ tab: 'list' });
    alert('수업이 등록되었습니다.');
  };

  const handleViewReservations = (classItem: Class) => {
    window.location.href = `/admin/class/${classItem.id}`;
  };

  const handleDeleteClass = (classId: string) => {
    if (!confirm('이 수업을 삭제하시겠습니까?')) return;
    deleteClass(classId);
  };

  return (
    <PageContainer>
      <PageHeader title="수업 관리" />

      {/* 탭바 */}
      <div className="mt-4 flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'register'
              ? 'border-b-2 border-[#63461E] text-[#63461E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          수업 등록
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'list'
              ? 'border-b-2 border-[#63461E] text-[#63461E]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          수업 목록
        </button>
      </div>

      {/* 수업 등록 탭 */}
      {activeTab === 'register' && (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => {
                const timeValue = e.target.value;
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
      )}

      {/* 수업 목록 탭 */}
      {activeTab === 'list' && (
        <div className="mt-4">
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
      )}
    </PageContainer>
  );
}
