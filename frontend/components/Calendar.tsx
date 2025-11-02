'use client';

import { useState, useEffect } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format } from 'date-fns';
import { Event } from '@/types/event';
import { apiClient } from '@/lib/api/client';
import { toast } from 'react-toastify';
import { User } from '@/lib/api/userClient';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import DayView from './views/DayView';
import Sidebar from './Sidebar';
import AccountProfile from './AccountProfile';
import EventModal from './EventModal';
import SearchBar from './SearchBar';
import QuickTemplates from './QuickTemplates';
import LoginScreen from './LoginScreen';
import UserMenu from './UserMenu';
import { motion } from 'framer-motion';

interface CalendarProps {
  initialDate: Date;
}

type ViewMode = 'month' | 'week' | 'day';

export default function Calendar({ initialDate }: CalendarProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>();
  const [modalTime, setModalTime] = useState<Date | undefined>();
  const [showSearch, setShowSearch] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [currentDate, viewMode, currentUser]);

  const handleUserSelect = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  const loadEvents = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);

      if (viewMode === 'month') {
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
      } else if (viewMode === 'week') {
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      } else {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 59);
      }

      const fetchedEvents = await apiClient.getEvents(currentUser.id, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setEvents(fetchedEvents);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setModalDate(date);
    setModalTime(undefined);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setModalDate(date);
    setModalTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour));
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalDate(undefined);
    setModalTime(undefined);
    setIsModalOpen(true);
  };

  const handleEventSaved = () => {
    loadEvents();
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
    }
  };

  if (!currentUser) {
    return <LoginScreen onUserSelect={(user) => handleUserSelect(user)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentDate={currentDate}
        selectedDate={selectedDate}
        events={events}
        onDateSelect={handleDateSelect}
        onViewChange={setViewMode}
        currentView={viewMode}
        currentUser={currentUser}
        onUserSelect={handleUserSelect}
        onSwitchUser={() => {
          setCurrentUser(null);
          localStorage.removeItem('currentUser');
        }}
      />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : viewMode === 'week' ? 'MMMM d, yyyy' : 'EEEE, MMMM d, yyyy')}
              </h1>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                🔍 Search
              </button>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                ⚡ Templates
              </button>
              <button
                onClick={() => handleDateClick(new Date())}
                disabled={!currentUser}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + New Event
              </button>
            </div>
          </div>

          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <SearchBar events={events} onEventClick={handleEventClick} />
            </motion.div>
          )}

          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <QuickTemplates
                selectedDate={currentDate}
                selectedTime={modalTime}
                onEventCreated={() => {
                  handleEventSaved();
                  setShowTemplates(false);
                }}
                userId={currentUser.id}
              />
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            {viewMode === 'month' && (
              <MonthView
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
              />
            )}
            {viewMode === 'day' && (
              <DayView
                currentDate={currentDate}
                events={events}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
              />
            )}
          </div>
        )}
      </div>

      <AccountProfile events={events} />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setModalDate(undefined);
          setModalTime(undefined);
        }}
        event={selectedEvent}
        defaultDate={modalDate}
        defaultTime={modalTime}
        onEventSaved={handleEventSaved}
        userId={currentUser?.id || ''}
      />
    </div>
  );
}

