import { useParams, useNavigate } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMemo } from 'react';
import { formatDisplayDate } from '@/utils/date';

type SavedClass = {
  id: string;
  date: string;
  time: string;
  location: string;
  wodId: string;
  capacity: number;
};

type SavedWod = {
  id: string;
  date: string;
  title: string;
  description: string;
};

type ReservedWod = {
  wodId: string;
  date: string;
  userId: string;
  userNickname: string;
};

export default function AdminClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classes] = useLocalStorage<SavedClass[]>('admin_classes', []);
  const [savedWods] = useLocalStorage<SavedWod[]>('wod_admin_saved', []);
  const [reservations] = useLocalStorage<ReservedWod[]>('reserved_wods', []);

  const classItem = useMemo(() => {
    return classes.find((c) => c.id === classId);
  }, [classes, classId]);

  const wodInfo = useMemo(() => {
    if (!classItem) return null;
    return savedWods.find((w) => w.id === classItem.wodId);
  }, [savedWods, classItem]);

  const classReservations = useMemo(() => {
    if (!classItem) return [];
    return reservations.filter((r) => r.wodId === classItem.wodId && r.date === classItem.date);
  }, [reservations, classItem]);

  if (!classItem) {
    return (
      <PageContainer>
        <PageHeader
          title="수업 정보 없음"
          actions={
            <button
              onClick={() => navigate('/admin/home')}
              className="text-sm px-3 py-1 bg-gray-500 text-white rounded"
            >
              목록으로
            </button>
          }
        />
        <p className="text-sm text-gray-500">해당 수업을 찾을 수 없습니다.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="수업 상세 정보"
        actions={
          <button
            onClick={() => navigate('/admin/home')}
            className="text-sm px-3 py-1 bg-gray-500 text-white rounded"
          >
            목록으로
          </button>
        }
      />

      <div className="mt-4 space-y-6">
        {/* 수업 기본 정보 */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold text-lg mb-3">수업 정보</h3>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">날짜</span>
              <span className="font-medium">{formatDisplayDate(classItem.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시간</span>
              <span className="font-medium">{classItem.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">장소</span>
              <span className="font-medium">{classItem.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">정원</span>
              <span className="font-medium">{classItem.capacity}명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">현재 예약</span>
              <span className="font-medium text-[#63461E]">{classReservations.length}명</span>
            </div>
          </div>
        </div>

        {/* WOD 정보 */}
        {wodInfo && (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold text-lg mb-3">WOD 정보</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">제목: </span>
                <span className="font-medium">{wodInfo.title}</span>
              </div>
              <div>
                <span className="text-gray-600">설명: </span>
                <div className="mt-1 p-3 bg-gray-50 rounded text-sm whitespace-pre-line">
                  {wodInfo.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 예약자 명단 */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold text-lg mb-3">예약자 명단 ({classReservations.length}명)</h3>

          {classReservations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">예약자가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {classReservations.map((reservation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src="/icons/profile.jpg"
                    alt="프로필 이미지"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-black">
                      {reservation.userNickname || '닉네임 없음'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reservation.userId || '이메일 없음'}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    예약완료
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 예약 현황 요약 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#63461E] text-white rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{classReservations.length}</div>
            <div className="text-xs">예약자 수</div>
          </div>
          <div className="bg-gray-500 text-white rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{classItem.capacity - classReservations.length}</div>
            <div className="text-xs">남은 자리</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

