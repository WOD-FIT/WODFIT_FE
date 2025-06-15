// src/pages/Record.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSave = () => {
    const newRecord = {
      id: uuid(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      text,
      time,
      exercises,
      tags: ['Interval', 'Machine'], // TODO: 나중에 선택 UI로 변경
    };

    const prev = JSON.parse(localStorage.getItem('wods') || '[]');
    localStorage.setItem('wods', JSON.stringify([newRecord, ...prev]));
    navigate('/my');
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mb-4">
        <label className="block font-semibold mb-1">WOD Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="수행한 WOD를 입력하세요."
          className="w-full border rounded-xl px-4 py-3 text-sm text-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">My Record</label>
        <div className="flex gap-2 items-center">
          <input
            value={time.min}
            onChange={(e) => setTime({ ...time, min: e.target.value })}
            className="w-16 border rounded-xl text-center py-2"
            placeholder="-"
          />
          <span>min</span>
          <input
            value={time.sec}
            onChange={(e) => setTime({ ...time, sec: e.target.value })}
            className="w-16 border rounded-xl text-center py-2"
            placeholder="-"
          />
          <span>second</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Weight of Exercise</label>

        {exercises.map((ex, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              value={ex.name}
              onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
              placeholder="Enter the name of exercise"
              className="flex-1 border-b text-sm py-1 outline-none"
            />
            <input
              value={ex.weight}
              onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
              className="w-16 border-b text-sm text-center py-1 outline-none"
              placeholder="-"
            />
            <span className="text-sm text-gray-500">lbs</span>
          </div>
        ))}

        <button
          onClick={addExercise}
          className="mt-2 px-3 py-1 bg-black text-white text-sm rounded"
        >
          + Add
        </button>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-[#6D4C1D] text-white py-3 rounded-xl font-semibold"
      >
        저장하기
      </button>
    </div>
  );
}
