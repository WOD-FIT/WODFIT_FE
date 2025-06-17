import { wodSort } from '@/api/wodSort';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';

export default function Record() {
  const [text, setText] = useState('');
  const [time, setTime] = useState({ min: '', sec: '' });
  const [exercises, setExercises] = useState([{ name: '', weight: '' }]);

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

      console.log(requestBody);

      const response = await wodSort(requestBody);
      console.log(response);

      const newRecord = {
        id: uuid(),
        date: new Date().toISOString().split('T')[0],
        text,
        time,
        exercises,
        tags: response.labels, // TODO: 태그 선택 UI로 나중에 개선
      };

      const prev = JSON.parse(localStorage.getItem('wods') || '[]');
      localStorage.setItem('wods', JSON.stringify([newRecord, ...prev]));

      navigate('/my');
    } catch (error) {
      console.error('WOD 분류 실패', error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      {/* WOD Text */}
      <div className="mb-6">
        <label className="block text-gray-600 text-base font-medium mb-2">WOD Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="수행한 WOD를 입력하세요."
          className="w-full h-24 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D4C1D]"
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
          <button onClick={addExercise} className="px-3 py-1 bg-black text-white text-sm rounded">
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
        className="w-full bg-[#6D4C1D] text-white py-3 rounded-xl font-semibold"
      >
        저장하기
      </button>
    </div>
  );
}
