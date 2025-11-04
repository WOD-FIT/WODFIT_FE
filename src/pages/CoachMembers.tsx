import { useEffect, useState } from 'react';

type Member = {
  id: string;
  name: string;
  membership: 'Active' | 'Paused' | 'Expired';
  attendance: number;
};

export default function CoachMembers() {
  const [list, setList] = useState<Member[]>([]);
  const [form, setForm] = useState<Omit<Member, 'id'>>({
    name: '',
    membership: 'Active',
    attendance: 0,
  });

  useEffect(() => {
    const raw = localStorage.getItem('coach_members');
    if (raw) setList(JSON.parse(raw));
  }, []);

  const persist = (next: Member[]) => localStorage.setItem('coach_members', JSON.stringify(next));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Member = { id: crypto.randomUUID(), ...form };
    const next = [item, ...list];
    setList(next);
    persist(next);
    setForm({ name: '', membership: 'Active', attendance: 0 });
  };

  const incAttendance = (id: string) => {
    const next = list.map((m) => (m.id === id ? { ...m, attendance: m.attendance + 1 } : m));
    setList(next);
    persist(next);
  };

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">코치 - 회원 관리</h2>
      <form onSubmit={add} className="mt-3 grid gap-3">
        <input
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.membership}
            onChange={(e) =>
              setForm((f) => ({ ...f, membership: e.target.value as Member['membership'] }))
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Active</option>
            <option>Paused</option>
            <option>Expired</option>
          </select>
          <input
            type="number"
            placeholder="출석"
            value={form.attendance}
            onChange={(e) => setForm((f) => ({ ...f, attendance: Number(e.target.value || 0) }))}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button className="h-11 rounded-lg bg-black text-white">추가</button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">회원 목록</h3>
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">아직 회원이 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {list.map((m) => (
              <li key={m.id} className="border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-600">
                    {m.membership} · 출석 {m.attendance}
                  </div>
                </div>
                <button
                  onClick={() => incAttendance(m.id)}
                  className="text-sm px-3 h-8 rounded-md bg-gray-900 text-white"
                >
                  출석 +1
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
