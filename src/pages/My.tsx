// src/pages/My.tsx
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
      <div className="mb-6">
        <div className="text-lg font-semibold">나의 WOD 기록</div>
      </div>

      <div className="space-y-4">
        {wods.map((wod) => (
          <div key={wod.id} className="p-4 bg-gray-50 rounded-xl shadow">
            <div className="text-sm font-semibold mb-1">{wod.date.replaceAll('-', '.')}</div>
            <div className="text-sm text-gray-800 whitespace-pre-line mb-2">{wod.text}</div>
            {wod.tags && (
              <div className="flex gap-2 mt-2">
                {wod.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-medium ${
                      tag === 'Interval' ? 'text-red-600' : 'text-blue-600'
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
