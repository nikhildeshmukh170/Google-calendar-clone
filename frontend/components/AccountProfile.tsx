'use client';

import { useMemo } from 'react';
import { Event } from '@/types/event';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, startOfDay, isSameDay } from 'date-fns';

interface AccountProfileProps {
  events: Event[];
}

export default function AccountProfile({ events }: AccountProfileProps) {
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const completedEvents = events.filter((e) => e.completed).length;
    const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

    const today = new Date();
    const todayEvents = events.filter((e) => isSameDay(new Date(e.startDate), today));
    const todayCompleted = todayEvents.filter((e) => e.completed).length;

    // Day streak calculation
    let streak = 0;
    const sortedCompleted = events
      .filter((e) => e.completed && e.completedAt)
      .map((e) => new Date(e.completedAt!).toISOString().split('T')[0])
      .sort()
      .reverse();

    if (sortedCompleted.length > 0) {
      let checkDate = startOfDay(new Date()).toISOString().split('T')[0];
      let index = 0;

      while (index < sortedCompleted.length) {
        if (sortedCompleted[index] === checkDate) {
          streak++;
          const prevDate = new Date(checkDate);
          prevDate.setDate(prevDate.getDate() - 1);
          checkDate = prevDate.toISOString().split('T')[0];
          index++;
        } else {
          break;
        }
      }
    }

    // Weekly comparison
    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const thisWeekEnd = endOfWeek(now);
    const lastWeekStart = startOfWeek(subWeeks(now, 1));
    const lastWeekEnd = endOfWeek(subWeeks(now, 1));

    const thisWeekEvents = events.filter((e) => {
      const eventDate = new Date(e.startDate);
      return eventDate >= thisWeekStart && eventDate <= thisWeekEnd;
    });
    const lastWeekEvents = events.filter((e) => {
      const eventDate = new Date(e.startDate);
      return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
    });

    const thisWeekCompleted = thisWeekEvents.filter((e) => e.completed).length;
    const lastWeekCompleted = lastWeekEvents.filter((e) => e.completed).length;
    const weekTrend = thisWeekCompleted - lastWeekCompleted;

    // Monthly comparison
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthEvents = events.filter((e) => {
      const eventDate = new Date(e.startDate);
      return eventDate >= thisMonthStart && eventDate <= thisMonthEnd;
    });
    const lastMonthEvents = events.filter((e) => {
      const eventDate = new Date(e.startDate);
      return eventDate >= lastMonthStart && eventDate <= lastMonthEnd;
    });

    const thisMonthCompleted = thisMonthEvents.filter((e) => e.completed).length;
    const lastMonthCompleted = lastMonthEvents.filter((e) => e.completed).length;
    const monthTrend = thisMonthCompleted - lastMonthCompleted;

    // Completion by day of week
    const dayStats = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
      const dayEvents = events.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate.getDay() === index;
      });
      const completed = dayEvents.filter((e) => e.completed).length;
      const total = dayEvents.length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;

      return { day, completed, total, percentage };
    });

    // Recent activity
    const recentEvents = events
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      totalEvents,
      completedEvents,
      completionRate,
      todayCompleted,
      streak,
      thisWeekCompleted,
      lastWeekCompleted,
      weekTrend,
      thisMonthCompleted,
      lastMonthCompleted,
      monthTrend,
      dayStats,
      recentEvents,
    };
  }, [events]);

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4 space-y-6 overflow-y-auto h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Account & Analytics</h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/50 rounded-lg p-4 text-white">
            <div className="text-sm opacity-90 mb-2">Total Events</div>
            <div className="text-3xl font-bold">{stats.totalEvents}</div>
          </div>

          <div className="rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.completedEvents} / {stats.totalEvents}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {stats.completionRate.toFixed(1)}%
            </div>
          </div>

          <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Day Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">This Week</div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.thisWeekCompleted}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stats.weekTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.weekTrend)} vs last week
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">This Month</div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.thisMonthCompleted}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stats.monthTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.monthTrend)} vs last month
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 p-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Completion by Day
            </div>
            <div className="space-y-2">
              {stats.dayStats.map((day) => (
                <div key={day.day} className="flex items-center gap-2">
                  <div className="w-10 text-xs text-gray-600 dark:text-gray-400">{day.day}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        day.percentage === 100
                          ? 'bg-green-500'
                          : day.percentage >= 50
                          ? 'bg-blue-500'
                          : day.percentage > 0
                          ? 'bg-yellow-500'
                          : ''
                      }`}
                      style={{ width: `${day.percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs text-gray-600 dark:text-gray-400 text-right">
                    {Math.round(day.percentage)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Recent Activity
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className={`text-sm p-2 rounded ${
                    event.completed
                      ? 'opacity-60 line-through bg-gray-200 dark:bg-gray-700'
                      : 'bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {format(new Date(event.startDate), 'MMM d, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


