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
    <div className="p-4 rounded-2xl bg-[#F9F9F9] shadow-md text-sm">
      <div className="font-semibold mb-2 text-black">{formatDisplayDate(date)}</div>
      <div className="text-gray-800 whitespace-pre-line mb-3">{text}</div>
      {time && (
        <div className="text-xs text-gray-600 mb-2">
          시간: {time.min}:{time.sec}
        </div>
      )}
      {tags && (
        <div className="flex gap-4 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-sm font-semibold ${
                tag === 'Interval' ? 'text-[#A11D1D]' : 'text-[#10527D]'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {showActions && (
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={onEdit} className="px-3 py-1 text-xs bg-[#63461E] text-white rounded">
              수정
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="px-3 py-1 text-xs bg-red-500 text-white rounded">
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
};
