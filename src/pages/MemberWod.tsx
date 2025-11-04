import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

type WodEntry = {
  id: string;
  date: string;
  title: string;
  description: string;
  intensity: 'Easy' | 'Moderate' | 'Hard';
  expectedPace?: string; // e.g., 15:30
  tags?: string[];
};

export default function MemberWod() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Omit<WodEntry, 'id'>>({
    date: today,
    title: '',
    description: '',
    intensity: 'Moderate',
    expectedPace: '',
    tags: [],
  });
  const [list, setList] = useState<WodEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('member_wod');
    if (raw) setList(JSON.parse(raw));
  }, []);

  const persist = (next: WodEntry[]) => localStorage.setItem('member_wod', JSON.stringify(next));

  const predictPace = useMemo(() => {
    if (!form.description.trim()) return '';
    const len = form.description.split(/\n|,/).filter(Boolean).length;
    const base = len * 45; // seconds per line heuristic
    const intensityScale = form.intensity === 'Easy' ? 0.9 : form.intensity === 'Hard' ? 1.2 : 1.0;
    const seconds = Math.round(base * intensityScale);
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [form.description, form.intensity]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: WodEntry = { id: crypto.randomUUID(), ...form, expectedPace: predictPace };
    const next = [item, ...list];
    setList(next);
    persist(next);
    setForm((p) => ({ ...p, title: '', description: '', tags: [] }));
    navigate('/my');
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">WOD 입력</h2>
      <form onSubmit={onSubmit} className="mt-3 grid gap-3">
        <label className="text-sm">
          <div className="mb-1">날짜</div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">제목</div>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">내용</div>
          <textarea
            name="description"
            rows={6}
            value={form.description}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">강도</div>
          <select
            name="intensity"
            value={form.intensity}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Easy</option>
            <option>Moderate</option>
            <option>Hard</option>
          </select>
        </label>
        <label className="text-sm">
          <div className="mb-1">태그 (쉼표로 구분, 예: Interval,Machine)</div>
          <input
            name="tags"
            value={(form.tags || []).join(',')}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                tags: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
        <div className="text-sm text-gray-700">
          예상 페이스: <span className="font-semibold">{predictPace || '-'}</span>
        </div>
        <button className="h-11 rounded-lg bg-[#63461E] text-white">저장</button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">내 WOD 기록</h3>
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">아직 기록이 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {list.map((it) => (
              <li key={it.id} className="border rounded-lg p-3">
                <div className="text-xs text-gray-500">
                  {it.date} · {it.intensity}
                </div>
                <div className="font-semibold">{it.title}</div>
                <pre className="whitespace-pre-wrap m-0 text-sm">{it.description}</pre>
                {it.tags && it.tags.length > 0 && (
                  <div className="mt-1 flex gap-2">
                    {it.tags.map((t) => (
                      <span key={t} className="text-xs text-[#63461E]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-600 mt-1">
                  예상 페이스: {it.expectedPace || '-'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
