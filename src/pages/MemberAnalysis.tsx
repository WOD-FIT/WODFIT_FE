import { useEffect, useMemo, useState } from 'react';

type Summary = { total: number; easy: number; moderate: number; hard: number };

export default function MemberAnalysis() {
  const [summary, setSummary] = useState<Summary>({ total: 0, easy: 0, moderate: 0, hard: 0 });

  useEffect(() => {
    const raw = localStorage.getItem('member_wod');
    if (!raw) return;
    const data = JSON.parse(raw) as Array<{ intensity: string }>;
    const s: Summary = { total: data.length, easy: 0, moderate: 0, hard: 0 };
    data.forEach((d) => {
      if (d.intensity === 'Easy') s.easy++;
      else if (d.intensity === 'Moderate') s.moderate++;
      else if (d.intensity === 'Hard') s.hard++;
    });
    setSummary(s);
  }, []);

  const weakness = useMemo(() => {
    const min = Math.min(summary.easy, summary.moderate, summary.hard);
    if (summary.total === 0) return '-';
    if (min === summary.hard) return '고강도 WOD 노출 부족';
    if (min === summary.moderate) return '중간 강도 WOD 노출 부족';
    return '저강도 WOD 노출 부족';
  }, [summary]);

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">강점/약점 분석</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">총 WOD</div>
          <div className="text-xl font-semibold">{summary.total}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Easy</div>
          <div className="text-xl font-semibold">{summary.easy}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Moderate</div>
          <div className="text-xl font-semibold">{summary.moderate}</div>
        </div>
        <div className="border rounded-lg p-3 col-span-3">
          <div className="text-xs text-gray-500">Hard</div>
          <div className="text-xl font-semibold">{summary.hard}</div>
        </div>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-gray-50">제안: {weakness}</div>
    </div>
  );
}
