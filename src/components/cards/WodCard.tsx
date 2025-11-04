import { formatDisplayDate } from '@/utils/date';

interface WodCardProps {
  date: string;
  text: string;
  tags?: string[];
  time?: { min: string; sec: string };
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const WodCard = ({
  date,
  text,
  tags,
  time,
  showActions = false,
  onEdit,
  onDelete,
}: WodCardProps) => {
  return (
    <div className="p-4 rounded-2xl bg-[#F9F9F9] dark:bg-[#2d2d2d] shadow-md text-sm border border-gray-100 dark:border-[#404040] transition-colors">
      <div className="font-semibold mb-2 text-black dark:text-white">{formatDisplayDate(date)}</div>
      <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-3">{text}</div>
      {time && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          시간: {time.min}:{time.sec}
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="flex gap-4 mb-3">
          {tags.map((tag) => {
            // 해시태그별 색상 설정 (4개 모두 다른 색상)
            let tagColor = 'text-[#10527D]'; // 기본 파란색
            if (tag === 'Interval') {
              tagColor = 'text-[#A11D1D]'; // 빨간색
            } else if (tag === 'Run') {
              tagColor = 'text-[#0F7B3C]'; // 초록색
            } else if (tag === 'Metcon') {
              tagColor = 'text-[#10527D]'; // 파란색
            } else if (tag === 'Barbell') {
              tagColor = 'text-[#8B5A2B]'; // 갈색
            }

            return (
              <span key={tag} className={`text-sm font-semibold ${tagColor}`}>
                #{tag}
              </span>
            );
          })}
        </div>
      )}
      {showActions && (
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-xs bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-xs bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
};
