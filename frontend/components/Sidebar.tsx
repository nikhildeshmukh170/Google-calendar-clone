"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { Event } from "@/types/event";
import { isHoliday } from "@/lib/holidays";
import DarkModeToggle from "./DarkModeToggle";
import UserMenu from "./UserMenu";
import { User } from "@/lib/api/userClient";
import CalendarLogo from "./CalendarLogo";

interface SidebarProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateSelect: (date: Date) => void;
  onViewChange: (view: "month" | "week" | "day") => void;
  currentView: "month" | "week" | "day";
  // pass user state from parent to place menu at bottom
  currentUser?: User | null;
  onUserSelect?: (user: User | null) => void;
  onSwitchUser?: () => void;
}

export default function Sidebar({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onViewChange,
  currentView,
  currentUser,
  onUserSelect,
  onSwitchUser,
}: SidebarProps) {
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(currentDate);
  const monthStart = startOfMonth(miniCalendarMonth);
  const monthEnd = endOfMonth(miniCalendarMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // user handlers are passed from parent (Calendar) via props; Sidebar is just a container for the menu

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const getCompletionStats = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return { completed: 0, total: 0 };
    const completed = dayEvents.filter((e) => e.completed).length;
    return { completed, total: dayEvents.length };
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={[isCollapsed ? 'w-[72px]' : 'w-[280px]', 'bg-white', 'dark:bg-gray-900', 'border-r', 'border-gray-200/75', 'dark:border-gray-700/75', 'h-screen', 'flex', 'flex-col', 'transition-all', 'duration-300', 'relative', 'group/sidebar'].join(' ')}>
      {/* Header Section with subtle gradient background */}
      <div className={[ 'flex-none', 'border-b', 'border-gray-100', 'dark:border-gray-800', 'bg-gradient-to-b', 'from-gray-50/50', 'to-transparent', 'dark:from-gray-900/50' ].join(' ')}>
        <div className="py-3 px-4">
          {isCollapsed ? (
            <div className={[ 'flex', 'flex-col', 'items-center', 'gap-3', 'w-full', 'py-2' ].join(' ')}>
              <CalendarLogo isCollapsed={isCollapsed} />
              <div className="mt-1">
                <DarkModeToggle />
              </div>
            </div>
          ) : (
            <div className={[ 'flex', 'items-center', 'justify-between', 'relative' ].join(' ')}>
              <div className={[ 'flex-1', 'ml-2' ].join(' ')}>
                <CalendarLogo isCollapsed={isCollapsed} />
              </div>
              <div className={[ 'flex', 'items-center', 'gap-1.5', 'mr-1' ].join(' ')}>
                <DarkModeToggle />
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Collapse sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Section: compact when collapsed, full controls when expanded */}
      <div className="flex-1 overflow-y-auto">
        {isCollapsed ? (
          <div className="px-2 flex flex-col items-center gap-4 mt-4">
            <button
              onClick={() => onDateSelect(new Date())}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:from-blue-600 hover:to-blue-700 transition-colors"
              title="Go to today"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-3 px-4 pt-4">
            <button
              onClick={() => onDateSelect(new Date())}
              className="relative group/today w-full h-11 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Go to today"
            >
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-blue-600 dark:text-blue-400">Today</span>
            </button>

            <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
              {(["month", "week", "day"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => onViewChange(view)}
                  className={[ 'flex-1', 'h-9', 'rounded-md', 'font-medium', 'text-sm', 'transition-all', 'duration-200', 'capitalize', currentView === view ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50' ].join(' ')}
                >
                  {view}
                </button>
              ))}
            </div>

            <div className="mt-2 px-0">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
                <div className="flex items-center justify-between mb-4 px-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {format(miniCalendarMonth, "MMMM yyyy")}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMiniCalendarMonth(subMonths(miniCalendarMonth, 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      title="Previous month"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setMiniCalendarMonth(addMonths(miniCalendarMonth, 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      title="Next month"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const isCurrentMonth = isSameMonth(day, miniCalendarMonth);
                    const stats = getCompletionStats(day);
                    const holiday = isHoliday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => {
                          onDateSelect(day);
                          setMiniCalendarMonth(day);
                        }}
                        className={[ 'relative', 'group', 'aspect-square', 'flex', 'items-center', 'justify-center', 'text-xs', 'font-medium', 'rounded-full', 'transition-all', 'duration-200', isToday(day) ? 'bg-blue-600 text-white hover:bg-blue-700' : selectedDate && isSameDay(day, selectedDate) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40' : isCurrentMonth ? 'text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600 hover:bg-white/50 dark:hover:bg-gray-700/50' ].join(' ')}
                      >
                        <span className="relative z-10">{format(day, "d")}</span>
                        {(stats.total > 0 || holiday) && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {stats.total > 0 && (
                              <div className="w-1 h-1 rounded-full bg-blue-500/70 dark:bg-blue-400/70" />
                            )}
                            {holiday && (
                              <div className="w-1 h-1 rounded-full bg-red-500/70 dark:bg-red-400/70" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with UserMenu and Collapse Button */}
      <div className="mt-auto flex flex-col">
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50`}>
          {!isCollapsed ? (
            <UserMenu
              currentUser={currentUser ?? null}
              onUserSelect={(u) => onUserSelect && onUserSelect(u)}
              onSwitchUser={() => onSwitchUser && onSwitchUser()}
            />
          ) : (
            currentUser && (
              <button 
                className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setIsCollapsed(false)}
                title={currentUser?.name || 'Expand sidebar'}
              >
                {(currentUser?.name?.charAt(0) || '?').toUpperCase()}
              </button>
            )
          )}
        </div>
        <div className="border-t border-gray-200/75 dark:border-gray-700/75">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full py-3 px-4 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors`}
          >
            {!isCollapsed && <span className="text-sm">Collapse sidebar</span>}
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
