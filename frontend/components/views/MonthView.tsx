'use client';

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Event } from '@/types/event';
import { isHoliday, isPastDate } from '@/lib/holidays';

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export default function MonthView({ currentDate, selectedDate, events, onDateClick, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const getCompletionStats = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = dayEvents.filter((e) => e.completed).length;
    const total = dayEvents.length;
    const percentage = (completed / total) * 100;
    return { completed, total, percentage };
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const stats = getCompletionStats(day);
          const holiday = isHoliday(day);
          const isPast = isPastDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] bg-white dark:bg-gray-900 p-2 transition-colors ${
                !isCurrentMonth ? 'opacity-50' : ''
              } ${
                isPast && !dayEvents.some((e) => e.id) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => {
                if (!isPast || dayEvents.length > 0) {
                  onDateClick(day);
                }
              }}
            >
              <div
                className="flex items-center justify-between mb-1"
              >
                <span
                  className={`text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center ${
                    isTodayDate
                      ? 'bg-primary text-white font-bold'
                      : isSelected && !isTodayDate
                      ? isCurrentMonth
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-semibold'
                        : 'text-gray-400 dark:text-gray-600'
                      : isCurrentMonth
                      ? isPast
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {holiday && (
                  <span className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded flex items-center gap-1">
                    🇮🇳 {holiday.name}
                  </span>
                )}
                {stats.total > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                    {stats.completed}/{stats.total}
                  </span>
                )}
              </div>

              {stats.total > 0 && (
                <div className="relative h-8 mb-2 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 water-fill">
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                    style={{
                      height: `${stats.percentage}%`,
                      background: stats.percentage === 100
                        ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                    }}
                  >
                    <div className="water-wave" />
                    <div className="water-shimmer" />
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="water-bubble"
                        style={{
                          left: `${20 + i * 30}%`,
                          bottom: `${10 + i * 10}%`,
                          width: `${5 + i * 2}px`,
                          height: `${5 + i * 2}px`,
                          animationDelay: `${i * 0.5}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 z-10">
                    {Math.round(stats.percentage)}%
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`text-xs px-2 py-1 rounded cursor-pointer truncate transition-all ${
                      event.completed
                        ? 'opacity-40 grayscale line-through'
                        : 'hover:opacity-80'
                    }`}
                    style={{ backgroundColor: event.color, color: 'white' }}
                  >
                    {event.completed && '✓ '}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

