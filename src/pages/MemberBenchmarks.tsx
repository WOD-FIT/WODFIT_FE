import { useEffect, useState } from 'react';

type Benchmark = { id: string; name: string; value: number | ''; unit: string };

export default function MemberBenchmarks() {
  const [list, setList] = useState<Benchmark[]>([]);
  const [form, setForm] = useState<Omit<Benchmark, 'id'>>({ name: '', value: '', unit: 'kg' });

  useEffect(() => {
    const raw = localStorage.getItem('member_benchmarks');
    if (raw) setList(JSON.parse(raw));
  }, []);

  const persist = (next: Benchmark[]) =>
    localStorage.setItem('member_benchmarks', JSON.stringify(next));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Benchmark = {
      id: crypto.randomUUID(),
      ...form,
      value: form.value === '' ? '' : Number(form.value),
    };
    const next = [item, ...list];
    setList(next);
    persist(next);
    setForm({ name: '', value: '', unit: form.unit });
  };

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">벤치마킹 정보</h2>
      <form onSubmit={onSubmit} className="mt-3 grid gap-3">
        <input
          placeholder="예: 백스쿼트 1RM"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="값"
            value={form.value}
            onChange={(e) =>
              setForm((f) => ({ ...f, value: e.target.value === '' ? '' : Number(e.target.value) }))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>kg</option>
            <option>rep</option>
            <option>sec</option>
          </select>
        </div>
        <button className="h-11 rounded-lg bg-black text-white">추가</button>
      </form>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">기록</h3>
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">아직 기록이 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {list.map((it) => (
              <li key={it.id} className="border rounded-lg p-3">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-700">
                  {String(it.value)} {it.unit}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
