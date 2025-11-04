import { useState, useMemo } from 'react';
import { getCalendarDays } from '@/utils/date';

type CalendarProps = {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  markedDates?: string[];
  className?: string;
};

export const Calendar = ({
  selectedDate,
  onDateSelect,
  markedDates = [],
  className = '',
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    return getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    onDateSelect(dateStr);
  };

  const hasMarkedDate = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return markedDates.includes(dateStr);
  };

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth('prev')} className="p-2 hover:bg-gray-100 rounded">
          ←
        </button>
        <h3 className="font-semibold">
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </h3>
        <button onClick={() => changeMonth('next')} className="p-2 hover:bg-gray-100 rounded">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isMarked = hasMarkedDate(day);
          const isSelected = selectedDate === day.toISOString().slice(0, 10);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                p-2 text-sm rounded relative
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                ${isToday ? 'bg-blue-100 font-bold' : ''}
                ${isSelected ? 'bg-[#63461E] text-white' : 'hover:bg-gray-100'}
              `}
            >
              {day.getDate()}
              {isMarked && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#63461E] rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
