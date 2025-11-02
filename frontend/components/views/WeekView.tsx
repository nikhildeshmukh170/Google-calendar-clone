'use client';

import { startOfWeek, endOfWeek, eachHourOfInterval, format, isSameHour, isSameDay, addDays, isToday } from 'date-fns';
import { Event } from '@/types/event';
import { isPastDate } from '@/lib/holidays';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: Event) => void;
}

export default function WeekView({ currentDate, events, onTimeSlotClick, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const hours = eachHourOfInterval({ start: new Date(2024, 0, 1, 0), end: new Date(2024, 0, 1, 23) });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      if (event.allDay) {
        return isSameDay(new Date(event.startDate), day);
      }
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  const getEventPosition = (event: Event, day: Date) => {
    if (event.allDay) return null;
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    if (!isSameDay(eventStart, day)) return null;
    
    const startHour = eventStart.getHours();
    const startMinutes = eventStart.getMinutes();
    const endHour = eventEnd.getHours();
    const endMinutes = eventEnd.getMinutes();
    
    // Calculate position within hour (0-60 minutes)
    const topOffset = (startMinutes / 60) * 100; // percentage within the hour slot
    const durationHours = (endHour - startHour) + (endMinutes - startMinutes) / 60;
    const height = Math.max(durationHours * 64, 20); // minimum 20px height
    
    return {
      top: startHour * 64 + (topOffset / 100) * 64, // 64px per hour slot
      height,
      startHour,
      startMinutes,
      endHour,
      endMinutes,
    };
  };

  return (
    <div className="flex-1 overflow-auto scrollbar-hide">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-8">
          <div className="p-2 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-2 text-center border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${
                isToday(day) ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {format(day, 'EEE')}
              </div>
              <div
                className={`text-lg font-bold ${
                  isToday(day) ? 'text-primary' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="grid grid-cols-8 relative" style={{ minHeight: 'calc(24 * 64px)' }}>
        {/* Time labels - sticky */}
        <div className="border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-10">
          {hours.map((hour) => (
            <div
              key={format(hour, 'HH')}
              className="h-16 border-b border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400"
            >
              {format(hour, 'h a')}
            </div>
          ))}
        </div>

        {/* Event columns */}
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const allDayEvents = dayEvents.filter((e) => e.allDay);
          const timedEvents = dayEvents.filter((e) => !e.allDay);
          
          return (
            <div key={day.toISOString()} className="border-r border-gray-200 dark:border-gray-700 relative">
              {/* All-day events bar - sticky */}
              {allDayEvents.length > 0 && (
                <div className="sticky top-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1 z-20">
                  {allDayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`text-xs px-2 py-1 rounded mb-1 cursor-pointer truncate ${
                        event.completed ? 'opacity-40 grayscale line-through' : 'hover:opacity-80'
                      }`}
                      style={{ backgroundColor: event.color, color: 'white' }}
                    >
                      {event.completed && '✓ '}
                      {event.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Hour slots container - relative for event positioning */}
              <div className="relative" style={{ paddingTop: allDayEvents.length > 0 ? '40px' : '0' }}>
                {hours.map((hour) => {
                  const now = new Date();
                  const isPast = isPastDate(day) || (isToday(day) && hour.getHours() < now.getHours());

                  return (
                    <div
                      key={`${day.toISOString()}-${hour.getHours()}`}
                      className={`h-16 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                        isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        if (!isPast) {
                          const clickDate = new Date(day);
                          clickDate.setHours(hour.getHours(), 0, 0, 0);
                          onTimeSlotClick(clickDate, hour.getHours());
                        }
                      }}
                    />
                  );
                })}

                {/* Positioned events at their exact time */}
                {timedEvents.map((event) => {
                  const position = getEventPosition(event, day);
                  if (!position) return null;

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer truncate shadow-sm z-20 ${
                        event.completed ? 'opacity-60 grayscale line-through' : 'hover:opacity-90 hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: event.color,
                        color: 'white',
                        top: `${position.top}px`,
                        height: `${position.height}px`,
                        minHeight: '20px',
                      }}
                      title={`${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')} ${event.title}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90">
                        {format(new Date(event.startDate), 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

