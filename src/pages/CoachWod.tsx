import { useEffect, useState } from 'react';

type CoachWodItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  scale: 'Rx' | 'Scaled' | 'Beginner';
};

export default function CoachWod() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Omit<CoachWodItem, 'id'>>({
    date: today,
    title: '',
    description: '',
    scale: 'Rx',
  });
  const [list, setList] = useState<CoachWodItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('coach_wod');
    if (raw) setList(JSON.parse(raw));
  }, []);

  const persist = (next: CoachWodItem[]) => localStorage.setItem('coach_wod', JSON.stringify(next));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CoachWodItem = { id: crypto.randomUUID(), ...form };
    const next = [item, ...list];
    setList(next);
    persist(next);
    setForm((p) => ({ ...p, title: '', description: '' }));
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">코치 - WOD/스케일</h2>
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
          <div className="mb-1">스케일</div>
          <select
            name="scale"
            value={form.scale}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Rx</option>
            <option>Scaled</option>
            <option>Beginner</option>
          </select>
        </label>
        <button className="h-11 rounded-lg bg-black text-white">저장</button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">등록된 WOD</h3>
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">아직 항목이 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {list.map((it) => (
              <li key={it.id} className="border rounded-lg p-3">
                <div className="text-xs text-gray-500">
                  {it.date} · {it.scale}
                </div>
                <div className="font-semibold">{it.title}</div>
                <pre className="whitespace-pre-wrap m-0 text-sm">{it.description}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
