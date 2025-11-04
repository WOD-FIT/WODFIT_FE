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
    <div className="border border-gray-200 dark:border-[#404040] rounded-lg p-4 bg-white dark:bg-[#2d2d2d] transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-lg text-gray-900 dark:text-white">
            {time} - {location}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">WOD: {wodTitle}</div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{date}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          정원: {capacity}명 | 예약: {reservationCount}명
        </div>
        <div className="flex gap-2">
          {onViewReservations && (
            <button
              onClick={onViewReservations}
              className="px-3 h-8 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white text-sm hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
            >
              예약자 보기
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 h-8 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
