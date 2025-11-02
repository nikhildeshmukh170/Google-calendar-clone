'use client';

import { useState, useEffect } from 'react';
import { Event, EventInput } from '@/types/event';
import { apiClient } from '@/lib/api/client';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  defaultDate?: Date;
  defaultTime?: Date;
  onEventSaved: () => void;
  userId: string;
}

const eventColors = [
  '#1a73e8', '#ea4335', '#fbbc04', '#34a853',
  '#9c27b0', '#ff9800', '#00bcd4', '#795548',
];

export default function EventModal({
  isOpen,
  onClose,
  event,
  defaultDate,
  defaultTime,
  onEventSaved,
  userId,
}: EventModalProps) {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState<EventInput>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    color: '#1a73e8',
    location: '',
    completed: false,
  });

  const formatDateForInput = (dateString: string, allDay?: boolean): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return allDay
        ? format(date, 'yyyy-MM-dd')
        : format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: event.startDate,
        endDate: event.endDate,
        allDay: event.allDay,
        color: event.color,
        location: event.location || '',
        completed: event.completed,
      });
    } else if (defaultDate) {
      const startDate = defaultTime || new Date(defaultDate);
      if (!defaultTime) {
        startDate.setHours(9, 0, 0, 0);
      }
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);

      setFormData({
        title: '',
        description: '',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        allDay: false,
        color: '#1a73e8',
        location: '',
        completed: false,
      });
    }
  }, [event, defaultDate, defaultTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (event) {
        await apiClient.updateEvent(event.id, formData, userId);
        toast.success('Event updated successfully!');
      } else {
        await apiClient.createEvent(formData, userId);
        toast.success('Event created successfully!');
      }
      onEventSaved();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const wasCompleted = event!.completed;
      await apiClient.updateEvent(event!.id, {
        completed: !event!.completed,
        completedAt: !event!.completed ? new Date().toISOString() : null,
      }, userId);
      
      if (!wasCompleted) {
        setShowConfetti(true);
        toast.success('Event completed! 🎉');
      } else {
        toast.success('Event marked as incomplete');
      }
      
      onEventSaved();
      if (!wasCompleted) {
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      await apiClient.deleteEvent(event.id, userId);
      toast.success('Event deleted successfully!');
      onEventSaved();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {event ? 'Edit Event' : 'Create Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                className="cursor-pointer"
                onClick={(e) => {
                  const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                  if (input) input.showPicker?.();
                }}
              >
                <label 
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
                >
                  Start {formData.allDay ? 'Date' : 'Date & Time'}
                </label>
                <input
                  id="start-date"
                  type={formData.allDay ? 'date' : 'datetime-local'}
                  required
                  value={formatDateForInput(formData.startDate, formData.allDay)}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const newDate = formData.allDay 
                      ? new Date(e.target.value + 'T00:00:00')
                      : new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setFormData({ ...formData, startDate: newDate.toISOString() });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </div>
              <div 
                className="cursor-pointer"
                onClick={(e) => {
                  const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                  if (input) input.showPicker?.();
                }}
              >
                <label 
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
                >
                  End {formData.allDay ? 'Date' : 'Date & Time'}
                </label>
                <input
                  id="end-date"
                  type={formData.allDay ? 'date' : 'datetime-local'}
                  required
                  value={formatDateForInput(formData.endDate, formData.allDay)}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const newDate = formData.allDay
                      ? new Date(e.target.value + 'T23:59:59')
                      : new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setFormData({ ...formData, endDate: newDate.toISOString() });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All-day event</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {eventColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-900 dark:border-gray-100 scale-110'
                        : 'border-gray-300 dark:border-gray-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {event && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={event.completed}
                    onChange={handleComplete}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as completed
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : event ? 'Update' : 'Create'}
              </button>
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

