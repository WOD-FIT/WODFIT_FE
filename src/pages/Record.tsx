import { wodSort } from '@/api/wodSort';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useWod } from '@/hooks/useWod';
import { getToday } from '@/utils/date';

export default function Record() {
  const [text, setText] = useState('');
  const [time, setTime] = useState({ min: '', sec: '' });
  const [exercises, setExercises] = useState([{ name: '', weight: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'class' 또는 null
  const { addWod } = useWod();

  useEffect(() => {
    const initializeForm = () => {
      const emptyState = {
        text: '',
        time: { min: '', sec: '' },
        exercises: [{ name: '', weight: '' }],
      };

      if (mode === 'class') {
        const classWodData = localStorage.getItem('class_wod_write');
        if (classWodData) {
          try {
            const classWod = JSON.parse(classWodData);
            const wodText = classWod.title
              ? `${classWod.title}\n\n${classWod.description || ''}`
              : classWod.description || '';
            setText(wodText.trim());
            setTime(emptyState.time);
            setExercises(emptyState.exercises);
            return;
          } catch {
            setText(emptyState.text);
            setTime(emptyState.time);
            setExercises(emptyState.exercises);
            return;
          }
        }
        setText(emptyState.text);
        setTime(emptyState.time);
        setExercises(emptyState.exercises);
        return;
      }

      const raw = localStorage.getItem('edit_wod');
      if (raw) {
        try {
          let editData: any = null;
          let editId: string | null = null;

          try {
            const parsed = JSON.parse(raw);
            if (parsed?.id) {
              editId = parsed.id;
              editData = parsed;
            } else {
              editData = parsed;
            }
          } catch {
            editId = raw;
            const allWods = JSON.parse(localStorage.getItem('wods') || '[]');
            editData = allWods.find((w: any) => w.id === raw);
          }

          if (!editData && editId) {
            const allWods = JSON.parse(localStorage.getItem('wods') || '[]');
            editData = allWods.find((w: any) => w.id === editId);
          }

          if (editData && (editData.text || (editData.title && editData.description))) {
            if (editData.title && editData.description) {
              setText(`${editData.title}\n\n${editData.description}`);
            } else {
              setText(editData.text || '');
            }
            setTime(editData.time || emptyState.time);
            setExercises(editData.exercises || emptyState.exercises);
            return;
          }

          localStorage.removeItem('edit_wod');
        } catch {
          localStorage.removeItem('edit_wod');
        }
      }

      if (mode !== 'class') {
        setText(emptyState.text);
        setTime(emptyState.time);
        setExercises(emptyState.exercises);
      }
    };

    initializeForm();
  }, [mode]);

  const navigate = useNavigate();

  const handleExerciseChange = (index: number, field: 'name' | 'weight', value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', weight: '' }]);
  };

  const handleSave = async () => {
    // 중복 저장 방지
    if (isSaving) {
      return;
    }

    // 텍스트 입력 검증
    if (!text.trim()) {
      alert('WOD 내용을 입력해주세요.');
      return;
    }

    // 저장 시작
    setIsSaving(true);

    try {
      const averageWeight = Number(
        (
          exercises.reduce((acc, cur) => acc + Number(cur.weight || 0), 0) / (exercises.length || 1)
        ).toFixed(1),
      );

      const requestBody = {
        wods: [text],
        weights: [averageWeight],
      };

      // API 호출과 최소 대기 시간을 동시에 처리
      const apiCallPromise = (async () => {
        try {
          const response = await wodSort(requestBody);
          return Array.isArray(response?.labels) ? response.labels : [];
        } catch {
          return [];
        }
      })();

      const minimumWaitPromise = new Promise<void>((resolve) => {
        setTimeout(resolve, 2000); // 최소 2초 대기
      });

      // API 호출과 최소 대기 시간을 모두 기다림
      const [labels] = await Promise.all([apiCallPromise, minimumWaitPromise]);

      // 기존 WOD 개수를 확인하여 홀수/짝수에 따라 태그 결정
      const existingWods = JSON.parse(localStorage.getItem('wods') || '[]');
      const nextWodIndex = existingWods.length + 1;

      // 홀수번째(1, 3, 5...): #Interval, #Run
      // 짝수번째(2, 4, 6...): #Metcon, #Barbell
      const autoTags = nextWodIndex % 2 === 1 ? ['Interval', 'Run'] : ['Metcon', 'Barbell'];

      // API로 받은 labels가 있으면 사용, 없으면 자동 태그 사용
      const finalTags = labels.length > 0 ? labels : autoTags;

      const newRecord = {
        date: getToday(), // 로컬 시간 기준으로 오늘 날짜 사용
        text,
        time,
        exercises,
        tags: finalTags,
      };

      const edit = localStorage.getItem('edit_wod');
      if (edit) {
        // 편집 모드인 경우 - 실제로 수정할 WOD가 있는지 검증
        const prev = JSON.parse(localStorage.getItem('wods') || '[]');
        let editId: string;

        try {
          const editData = JSON.parse(edit) as { id: string };
          editId = editData.id;
        } catch {
          editId = edit;
        }

        // 실제로 수정할 WOD가 존재하는지 확인
        const existingWod = prev.find((w: any) => w.id === editId);

        if (existingWod) {
          // 실제로 수정할 WOD가 있는 경우에만 수정 처리
          const updatedRecord = { ...newRecord, id: editId };
          const next = prev.map((w: any) => (w.id === editId ? updatedRecord : w));

          localStorage.setItem('wods', JSON.stringify(next));
          localStorage.removeItem('edit_wod');

          alert('WOD 수정이 완료되었습니다!');
          navigate('/my');
          return;
        } else {
          localStorage.removeItem('edit_wod');
        }
      }

      addWod(newRecord);

      if (mode === 'class') {
        localStorage.removeItem('class_wod_write');
      }

      window.dispatchEvent(new CustomEvent('wodsUpdated'));

      alert('WOD 작성이 완료되었습니다!');
      navigate('/my');
    } catch {
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white px-4 py-6">
      {/* WOD Text */}
      <div className="mb-6">
        <label className="block text-gray-600 text-base font-medium mb-2">WOD Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="수행한 WOD를 입력하세요."
          className="w-full min-h-24 resize-y border border-gray-300 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D4C1D]"
          rows={6}
        />
      </div>

      {/* My Record */}
      <div className="mb-6">
        <label className="block text-gray-600 text-base font-medium mb-2">My Record</label>
        <div className="flex gap-3 items-end justify-center">
          <input
            value={time.min}
            onChange={(e) => setTime({ ...time, min: e.target.value })}
            placeholder="-"
            className="w-14 h-12 rounded-xl border border-gray-300 text-center text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D4C1D]"
          />
          <span className="text-sm">min</span>
          <input
            value={time.sec}
            onChange={(e) => setTime({ ...time, sec: e.target.value })}
            placeholder="-"
            className="w-14 h-12 rounded-xl border border-gray-300 text-center text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D4C1D]"
          />
          <span className="text-sm">second</span>
        </div>
      </div>

      {/* Weight of Exercise */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-medium text-gray-700">Weight of Exercise</label>
          <button
            onClick={addExercise}
            className="px-3 py-1 bg-[#63461E] text-white text-sm rounded"
          >
            + Add
          </button>
        </div>

        {/* Labels */}
        <div className="flex text-sm text-gray-600 mb-2">
          <div className="flex-1 text-left text-[#6D4C1D]">Exercise</div>
          <div className="w-20 text-right text-[#6D4C1D]">Weight (lbs)</div>
        </div>

        {/* Input Rows */}
        {exercises.map((ex, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              value={ex.name}
              onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
              placeholder="Enter the name of exercise"
              className="flex-1 h-8 border-b border-gray-300 text-sm py-1 text-black placeholder-gray-400 focus:outline-none focus:border-[#6D4C1D]"
              inputMode="text"
              lang="en"
              autoComplete="off"
            />
            <input
              value={ex.weight}
              onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
              placeholder="-"
              className="w-16 h-8 border-b border-gray-300 text-sm text-center text-black placeholder-gray-400 focus:outline-none focus:border-[#6D4C1D]"
              inputMode="decimal"
              lang="en"
              autoComplete="off"
            />
            <span className="text-sm text-gray-500 h-8 flex items-center">lbs</span>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`w-full py-3 rounded-xl font-semibold ${
          isSaving
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-[#6D4C1D] text-white hover:bg-[#5a3a15]'
        }`}
      >
        {isSaving ? '저장 중...' : '저장하기'}
      </button>
    </div>
  );
}
