type ClassCardProps = {
  date: string;
  time: string;
  location: string;
  wodTitle: string;
  capacity: number;
  reservationCount: number;
  onViewReservations?: () => void;
  onDelete?: () => void;
};

export const ClassCard = ({
  date,
  time,
  location,
  wodTitle,
  capacity,
  reservationCount,
  onViewReservations,
  onDelete,
}: ClassCardProps) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-lg">
            {time} - {location}
          </div>
          <div className="text-sm text-gray-600">WOD: {wodTitle}</div>
        </div>
        <div className="text-xs text-gray-500">{date}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          정원: {capacity}명 | 예약: {reservationCount}명
        </div>
        <div className="flex gap-2">
          {onViewReservations && (
            <button
              onClick={onViewReservations}
              className="px-3 h-8 rounded-lg bg-[#63461E] text-white text-sm"
            >
              예약자 보기
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 h-8 rounded-lg border border-red-300 text-red-600 text-sm"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
