import { useState, useMemo, useEffect } from 'react';
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
  // selectedDate가 있으면 해당 날짜의 월로 초기화, 없으면 오늘 날짜로
  const getInitialMonth = () => {
    if (selectedDate) {
      const [year, month] = selectedDate.split('-').map(Number);
      return new Date(year, month - 1, 1);
    }
    return new Date();
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);

  // selectedDate가 변경되면 해당 날짜의 월로 이동
  useEffect(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split('-').map(Number);
      const newMonth = new Date(year, month - 1, 1);
      // 현재 표시 중인 월과 다를 때만 업데이트
      setCurrentMonth((prev) => {
        if (
          prev.getFullYear() !== newMonth.getFullYear() ||
          prev.getMonth() !== newMonth.getMonth()
        ) {
          return newMonth;
        }
        return prev;
      });
    } else {
      // selectedDate가 null이면 오늘 날짜의 월로 이동
      const today = new Date();
      const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setCurrentMonth((prev) => {
        if (
          prev.getFullYear() !== todayMonth.getFullYear() ||
          prev.getMonth() !== todayMonth.getMonth()
        ) {
          return todayMonth;
        }
        return prev;
      });
    }
  }, [selectedDate]);

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
    // 로컬 시간 기준으로 날짜 문자열 생성 (타임존 문제 해결)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    onDateSelect(dateStr);
  };

  const hasMarkedDate = (date: Date) => {
    // 로컬 시간 기준으로 날짜 문자열 생성
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return markedDates.includes(dateStr);
  };

  return (
    <div
      className={`border border-gray-200 dark:border-[#404040] rounded-lg p-4 bg-white dark:bg-[#2d2d2d] transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth('prev')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded text-gray-700 dark:text-gray-300 transition-colors"
        >
          ←
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </h3>
        <button
          onClick={() => changeMonth('next')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded text-gray-700 dark:text-gray-300 transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 p-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isMarked = hasMarkedDate(day);
          // 로컬 시간 기준으로 날짜 문자열 생성하여 비교
          const year = day.getFullYear();
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const dayNum = String(day.getDate()).padStart(2, '0');
          const dayStr = `${year}-${month}-${dayNum}`;
          const isSelected = selectedDate === dayStr;

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                p-2 text-sm rounded relative transition-colors
                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                ${isToday ? 'bg-[#63461E]/20 dark:bg-[#D4A574]/30 font-bold' : ''}
                ${
                  isSelected
                    ? 'bg-[#63461E] dark:bg-[#D4A574] text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-[#3a3a3a]'
                }
              `}
            >
              {day.getDate()}
              {isMarked && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#63461E] dark:bg-[#D4A574] rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
