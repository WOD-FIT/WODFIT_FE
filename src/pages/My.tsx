import { useEffect, useState } from 'react';

interface Wod {
  id: string;
  date: string;
  text: string;
  time: { min: string; sec: string };
  exercises: { name: string; weight: string }[];
  tags?: string[];
}

export default function My() {
  const [wods, setWods] = useState<Wod[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('wods') || '[]');
    setWods(data);
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <img
          src="/icons/profile.png"
          alt="프로필 이미지"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="ml-4">
          <div className="text-xl font-semibold text-black">김철홍</div>
          <div className="text-[#6D4C1D] text-sm mt-1">크로스핏 뉴젠</div>
          <div className="text-sm text-gray-500 mt-1">keaikim77@gmail.com</div>
        </div>
      </div>

      {/* 나의 WOD 기록 제목 */}
      <div className="text-base font-semibold text-black mb-4">나의 WOD 기록</div>

      {/* WOD 카드들 */}
      <div className="space-y-4">
        {wods.map((wod) => (
          <div key={wod.id} className="p-4 rounded-2xl bg-[#F9F9F9] shadow-md text-sm">
            <div className="font-semibold mb-2 text-black">{wod.date.replaceAll('-', '.')}</div>
            <div className="text-gray-800 whitespace-pre-line mb-3">{wod.text}</div>
            {wod.tags && (
              <div className="flex gap-4">
                {wod.tags.map((tag) => (
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
        ))}
      </div>
    </div>
  );
}
