import { useEffect, useState } from 'react';
import WodCard from '../components/WODCard';
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
    <div className="min-h-screen bg-white px-8 py-9 flex flex-col ">
      {/* Header */}
      <div className="flex items-center gap-9 mb-8">
        <img
          src="/icons/profile.jpg"
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex flex-col ">
          <div className="text-xl font-semibold text-black">김철홍</div>
          <div className="text-[#6D4C1D] text-sm mt-1">크로스핏 뉴젠</div>
          <div className="text-sm text-gray-500 mt-1">keaikim77@gmail.com</div>
        </div>
      </div>

      {/* 나의 WOD 기록 제목 */}
      <div className="text-base font-semibold text-black mb-4">나의 WOD 기록</div>

      {/* WOD 카드들 */}
      <div className="flex flex-col gap-4">
        {wods.map((wod) => (
          <WodCard key={wod.id} date={wod.date} text={wod.text} tags={wod.tags} />
        ))}
      </div>
    </div>
  );
}
