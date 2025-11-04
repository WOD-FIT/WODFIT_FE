import { wodSort } from '@/api/wodSort';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useWod } from '@/hooks/useWod';

export default function Record() {
  const [text, setText] = useState('');
  const [time, setTime] = useState({ min: '', sec: '' });
  const [exercises, setExercises] = useState([{ name: '', weight: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'class' 또는 null
  const { addWod } = useWod();

  // 페이지 로드 시 초기화 (한 번만 실행)
  useEffect(() => {
    console.log('Record 페이지 로드, mode:', mode);

    // 1. 수업 완료 후 작성 모드 (우선순위 1)
    if (mode === 'class') {
      const classWodData = localStorage.getItem('class_wod_write');
      console.log('Record 페이지 - classWodData:', classWodData);

      if (classWodData) {
        try {
          const classWod = JSON.parse(classWodData);
          console.log('수업 WOD 데이터 파싱 성공:', classWod);

          // 수업 WOD 내용을 WOD Text 필드에 자동으로 채우기
          // title과 description을 합쳐서 표시 (예: "For Time - 5RFT\n\n800-meter run\n40 wall-ball shots...")
          const wodText = classWod.title
            ? `${classWod.title}\n\n${classWod.description || ''}`
            : classWod.description || '';

          setText(wodText.trim());
          setTime({ min: '', sec: '' });
          setExercises([{ name: '', weight: '' }]);

          console.log('✅ 수업 WOD 모드: WOD Text 자동 채움 완료');
          console.log('WOD Text 내용:', wodText);

          // localStorage는 저장할 때 제거하므로 여기서는 유지
          return;
        } catch (error) {
          console.error('수업 WOD 데이터 파싱 실패:', error);
          // 에러 시 빈 상태로 초기화
          setText('');
          setTime({ min: '', sec: '' });
          setExercises([{ name: '', weight: '' }]);
          return;
        }
      } else {
        // mode=class인데 데이터가 없으면 일반 모드로
        console.log('수업 모드이지만 데이터 없음, 일반 모드로 전환');
        setText('');
        setTime({ min: '', sec: '' });
        setExercises([{ name: '', weight: '' }]);
        return;
      }
    }

    // 2. 편집 모드 (우선순위 2)
    const raw = localStorage.getItem('edit_wod');
    if (raw) {
      try {
        // My.tsx에서 전달하는 경우: 문자열 ID
        // Admin에서 전달하는 경우: JSON 객체
        let editData: any;
        let editId: string | null = null;

        try {
          editData = JSON.parse(raw);
          // JSON 객체인 경우 id 필드 추출
          if (editData && editData.id) {
            editId = editData.id;
          }
        } catch {
          // 문자열 ID인 경우
          editId = raw;
          const allWods = JSON.parse(localStorage.getItem('wods') || '[]');
          const foundWod = allWods.find((w: any) => w.id === raw);
          if (foundWod) {
            editData = foundWod;
          }
        }

        // editId가 있으면 실제 WOD를 찾아서 검증
        if (editId && !editData) {
          const allWods = JSON.parse(localStorage.getItem('wods') || '[]');
          const foundWod = allWods.find((w: any) => w.id === editId);
          if (foundWod) {
            editData = foundWod;
          }
        }

        if (editData && (editData.text || (editData.title && editData.description))) {
          // 실제 편집할 데이터가 있는 경우에만 편집 모드로 처리
          console.log('편집 모드로 로드:', editData);

          // Admin에서 전달된 WOD 정보 로드
          if (editData.title && editData.description) {
            setText(`${editData.title}\n\n${editData.description}`);
          } else {
            setText(editData.text || '');
          }
          setTime(editData.time || { min: '', sec: '' });
          setExercises(editData.exercises || [{ name: '', weight: '' }]);
          return;
        } else {
          // 편집할 WOD를 찾지 못한 경우 - 일반 작성 모드로 전환
          console.log('편집할 WOD를 찾지 못함, 일반 작성 모드로 전환');
          localStorage.removeItem('edit_wod');
          setText('');
          setTime({ min: '', sec: '' });
          setExercises([{ name: '', weight: '' }]);
        }
      } catch (error) {
        console.error('Error loading edit WOD:', error);
        // 에러 발생 시에도 일반 작성 모드로 전환
        localStorage.removeItem('edit_wod');
        setText('');
        setTime({ min: '', sec: '' });
        setExercises([{ name: '', weight: '' }]);
      }
    }

    // 3. 일반 WOD 작성 모드 (기본) - WOD Text 비어있음
    if (mode !== 'class') {
      console.log('일반 WOD 작성 모드: WOD Text 비어있음');
      setText('');
      setTime({ min: '', sec: '' });
      setExercises([{ name: '', weight: '' }]);
    }
  }, [mode]); // mode가 변경될 때만 실행

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

      let labels: string[] = [];
      try {
        // API 호출 타임아웃 설정 (2초)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('타임아웃')), 2000),
        );
        const apiPromise = wodSort(requestBody);
        const response = (await Promise.race([apiPromise, timeoutPromise])) as any;
        labels = Array.isArray(response?.labels) ? response.labels : [];
      } catch (e) {
        // API 실패해도 저장은 진행 (타임아웃 포함)
        labels = [];
      }

      // 기존 WOD 개수를 확인하여 홀수/짝수에 따라 태그 결정
      const existingWods = JSON.parse(localStorage.getItem('wods') || '[]');
      const nextWodIndex = existingWods.length + 1; // 새로 추가될 WOD의 인덱스

      // 홀수번째(1, 3, 5...): #Interval, #Run
      // 짝수번째(2, 4, 6...): #Metcon, #Barbell
      const autoTags =
        nextWodIndex % 2 === 1
          ? ['Interval', 'Run'] // 홀수번째
          : ['Metcon', 'Barbell']; // 짝수번째

      // API로 받은 labels가 있으면 사용, 없으면 자동 태그 사용
      const finalTags = labels.length > 0 ? labels : autoTags;

      const newRecord = {
        date: new Date().toISOString().split('T')[0],
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
          // 수정할 WOD가 없으면 일반 저장으로 처리
          console.log('수정할 WOD를 찾지 못함, 일반 저장으로 처리');
          localStorage.removeItem('edit_wod');
          // 아래 새 WOD 추가 로직으로 진행
        }
      }

      // 새 WOD 추가 (edit_wod가 없거나, 수정할 WOD를 찾지 못한 경우)
      {
        // 새 WOD 추가
        addWod(newRecord);

        // localStorage에 직접 저장 확인
        const savedWods = JSON.parse(localStorage.getItem('wods') || '[]');
        console.log('저장 후 localStorage 확인:', savedWods);
        console.log('저장된 WOD 개수:', savedWods.length);

        // 수업 WOD 모드였다면 localStorage 정리
        if (mode === 'class') {
          localStorage.removeItem('class_wod_write');
        }

        // 커스텀 이벤트 트리거하여 다른 컴포넌트에 알림
        window.dispatchEvent(new CustomEvent('wodsUpdated', { detail: savedWods }));
      }

      // 저장 성공 팝업
      alert('WOD 작성이 완료되었습니다!');

      // 저장 성공 후 즉시 My 페이지로 이동
      navigate('/my');
    } catch (error) {
      console.error('WOD 저장 실패', error);
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
            />
            <input
              value={ex.weight}
              onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
              placeholder="-"
              className="w-16 h-8 border-b border-gray-300 text-sm text-center text-black placeholder-gray-400 focus:outline-none focus:border-[#6D4C1D]"
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
