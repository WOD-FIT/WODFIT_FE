import { useEffect, useMemo, useState } from 'react';

type BoardRow = { id: string; name: string; score: number };

export default function Leaderboard() {
  const [rows, setRows] = useState<BoardRow[]>([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState<number | ''>('');

  useEffect(() => {
    const raw = localStorage.getItem('leaderboard');
    if (raw) setRows(JSON.parse(raw));
  }, []);

  const persist = (next: BoardRow[]) => localStorage.setItem('leaderboard', JSON.stringify(next));

  const add = () => {
    if (!name || score === '') return;
    const next = [...rows, { id: crypto.randomUUID(), name, score: Number(score) }];
    setRows(next);
    persist(next);
    setName('');
    setScore('');
  };

  const sorted = useMemo(() => [...rows].sort((a, b) => b.score - a.score), [rows]);

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">리더보드</h2>
      <div className="mt-3 flex gap-2">
        <input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="점수"
          value={score}
          onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-28 border rounded-lg px-3 py-2"
        />
        <button onClick={add} className="px-4 rounded-lg bg-black text-white">
          추가
        </button>
      </div>
      <ul className="mt-4 divide-y border rounded-lg">
        {sorted.map((r, idx) => (
          <li key={r.id} className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-semibold">{idx + 1}</span>
              <span>{r.name}</span>
            </div>
            <span className="font-mono">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
