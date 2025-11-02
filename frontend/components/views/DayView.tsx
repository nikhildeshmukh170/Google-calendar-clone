'use client';

import { eachHourOfInterval, format, isSameHour, isToday } from 'date-fns';
import { Event } from '@/types/event';
import { isPastDate } from '@/lib/holidays';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: Event) => void;
}

export default function DayView({ currentDate, events, onTimeSlotClick, onEventClick }: DayViewProps) {
  const hours = eachHourOfInterval({ start: new Date(2024, 0, 1, 0), end: new Date(2024, 0, 1, 23) });

  const getEventPosition = (event: Event) => {
    if (event.allDay) return null;
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    // Check if event is on current date
    if (
      eventStart.getFullYear() !== currentDate.getFullYear() ||
      eventStart.getMonth() !== currentDate.getMonth() ||
      eventStart.getDate() !== currentDate.getDate()
    ) {
      return null;
    }
    
    const startHour = eventStart.getHours();
    const startMinutes = eventStart.getMinutes();
    const endHour = eventEnd.getHours();
    const endMinutes = eventEnd.getMinutes();
    
    // Calculate position within hour (0-60 minutes)
    const topOffset = (startMinutes / 60) * 100; // percentage within the hour slot
    const durationHours = (endHour - startHour) + (endMinutes - startMinutes) / 60;
    const height = Math.max(durationHours * 64, 20); // minimum 20px height, 64px per hour
    
    return {
      top: startHour * 64 + (topOffset / 100) * 64, // 64px per hour slot
      height,
      startHour,
      startMinutes,
      endHour,
      endMinutes,
    };
  };

  const allDayEvents = events.filter((event) => {
    if (!event.allDay) return false;
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getDate() === currentDate.getDate()
    );
  });

  const timedEvents = events.filter((e) => !e.allDay);

  return (
    <div className="flex-1 overflow-a scrollbar-hide overflow-y-auto">
      {/* All-day events - sticky */}
      {allDayEvents.length > 0 && (
        <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">All Day</div>
          <div className="space-y-1">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`text-sm px-3 py-2 rounded cursor-pointer transition-all ${
                  event.completed ? 'opacity-40 grayscale line-through' : 'hover:opacity-80'
                }`}
                style={{ backgroundColor: event.color, color: 'white' }}
              >
                {event.completed && '✓ '}
                {event.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable timeline */}
      <div className="flex relative" style={{ minHeight: 'calc(24 * 64px)' }}>
        {/* Time labels - sticky */}
        <div className="w-20 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-10">
          {hours.map((hour) => (
            <div
              key={format(hour, 'HH')}
              className="h-16 border-b border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400"
            >
              {format(hour, 'h a')}
            </div>
          ))}
        </div>

        {/* Time slots with events */}
        <div className="flex-1 relative">
          {hours.map((hour) => {
            const now = new Date();
            const isPast = isPastDate(currentDate) || (isToday(currentDate) && hour.getHours() < now.getHours());

            return (
              <div
                key={hour.getHours()}
                className={`h-16 border-b border-gray-200 dark:border-gray-700 transition-colors relative ${
                  isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  if (!isPast) {
                    const clickDate = new Date(currentDate);
                    clickDate.setHours(hour.getHours(), 0, 0, 0);
                    onTimeSlotClick(clickDate, hour.getHours());
                  }
                }}
              />
            );
          })}

          {/* Positioned events at their exact time */}
          {timedEvents.map((event) => {
            const position = getEventPosition(event);
            if (!position) return null;

            return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                className={`absolute left-2 right-2 rounded px-2 py-1 text-xs cursor-pointer shadow-sm z-20 ${
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
                  {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

