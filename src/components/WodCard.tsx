// src/components/WodCard.tsx
interface WodCardProps {
  date: string;
  text: string;
  tags?: string[];
}

export default function WodCard({ date, text, tags }: WodCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-[#F9F9F9] shadow-md text-sm">
      <div className="font-semibold mb-2 text-black">{date.replaceAll('-', '.')}</div>
      <div className="text-gray-800 whitespace-pre-line mb-3">{text}</div>
      {tags && (
        <div className="flex gap-4">
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
    </div>
  );
}
