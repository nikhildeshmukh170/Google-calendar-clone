'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from '@/lib/api/client';
import { EventInput } from '@/types/event';
import { format, addMinutes } from 'date-fns';

interface QuickTemplatesProps {
  selectedDate: Date;
  selectedTime?: Date;
  onEventCreated: () => void;
  userId: string;
}

const templates = [
  {
    name: 'Meeting',
    duration: 30,
    color: '#1a73e8',
  },
  {
    name: 'Team Lunch',
    duration: 60,
    color: '#ea4335',
  },
  {
    name: 'Personal Break',
    duration: 15,
    color: '#fbbc04',
  },
  {
    name: 'Conference Call',
    duration: 60,
    color: '#34a853',
  },
];

export default function QuickTemplates({
  selectedDate,
  selectedTime,
  onEventCreated,
  userId,
}: QuickTemplatesProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const createEvent = async (template: typeof templates[0]) => {
    setLoading(template.name);

    try {
      const startDateTime = selectedTime || new Date(selectedDate);
      startDateTime.setHours(selectedTime ? selectedTime.getHours() : 9, selectedTime ? selectedTime.getMinutes() : 0, 0, 0);

      const endDateTime = addMinutes(startDateTime, template.duration);

      const eventData: EventInput = {
        title: template.name,
        description: `Quick template: ${template.name}`,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        allDay: false,
        color: template.color,
        completed: false,
      };

      await apiClient.createEvent(eventData, userId);
      toast.success(`${template.name} event created!`);
      onEventCreated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((template) => (
        <button
          key={template.name}
          onClick={() => createEvent(template)}
          disabled={loading === template.name}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: template.color }}
        >
          {loading === template.name ? 'Creating...' : template.name}
        </button>
      ))}
    </div>
  );
}

