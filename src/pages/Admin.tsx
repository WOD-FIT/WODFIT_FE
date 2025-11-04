import { useEffect, useState } from 'react';

type WodPayload = {
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
};

type SavedWod = WodPayload & { id: string };

export default function Admin() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<WodPayload>({ date: today, title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savedList, setSavedList] = useState<SavedWod[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('wod_admin_saved');
    if (raw) {
      try {
        setSavedList(JSON.parse(raw));
      } catch {
        setSavedList([]);
      }
    }
  }, []);

  const persistList = (list: SavedWod[]) => {
    setSavedList(list);
    localStorage.setItem('wod_admin_saved', JSON.stringify(list));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.title.trim() || !form.description.trim()) {
      setMessage('제목과 내용을 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 200));
      let next: SavedWod[] = savedList;
      if (editingId) {
        next = savedList.map((it) => (it.id === editingId ? { ...it, ...form } : it));
        setEditingId(null);
      } else {
        const newItem: SavedWod = { id: crypto.randomUUID(), ...form };
        next = [newItem, ...savedList];
      }
      persistList(next);
      setMessage('오늘의 WOD가 등록되었습니다.');

      if (!editingId) {
        // 새로 등록된 WOD의 ID
        const newWodId = next[0].id;

        // 수업 등록 확인 팝업
        setTimeout(() => {
          const shouldRegisterClass = confirm('등록한 WOD로 수업등록하시겠습니까?');

          if (shouldRegisterClass) {
            // 수업 등록 페이지로 이동하고, 방금 등록한 WOD를 미리 선택
            localStorage.setItem('selected_wod_for_class', newWodId);
            window.location.href = '/admin/class';
          } else {
            // 폼 초기화
            setForm({ date: today, title: '', description: '' });
          }
        }, 500);
      } else {
        setForm((prev) => ({ ...prev, title: '', description: '' }));
      }
    } catch (err) {
      setMessage('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 w-full">
      <h2 className="text-xl font-bold">WOD 등록</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          <div className="mb-1 text-gray-700">날짜</div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#63461E]"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 text-gray-700">제목</div>
          <input
            name="title"
            placeholder="예: For Time - 5RFT"
            value={form.title}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#63461E]"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 text-gray-700">내용</div>
          <textarea
            name="description"
            placeholder={`예:\n- 400m Run\n- 21 Air Squats\n- 15 Push-ups\n- 9 Pull-ups`}
            rows={8}
            value={form.description}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#63461E]"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 rounded-lg bg-[#63461E] text-white font-medium disabled:opacity-60"
        >
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">저장된 WOD</h3>
        {savedList.length === 0 ? (
          <p className="text-sm text-gray-600">아직 저장된 항목이 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {savedList.map((item) => (
              <li key={item.id} className="border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-500">{item.date}</div>
                <div className="font-semibold">{item.title}</div>
                <pre className="whitespace-pre-wrap m-0 text-sm">{item.description}</pre>
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 h-9 rounded-lg bg-[#63461E] text-white"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        date: item.date,
                        title: item.title,
                        description: item.description,
                      });
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="px-3 h-9 rounded-lg border border-red-300 text-red-600"
                    onClick={() => {
                      if (!confirm('삭제하시겠습니까?')) return;
                      const next = savedList.filter((it) => it.id !== item.id);
                      persistList(next);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
