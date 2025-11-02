import { Event, EventInput } from '@/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | Array<{ path: string; message: string }>;
  message?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string' 
        ? data.error 
        : data.error?.map((e: any) => e.message).join(', ') || 'An error occurred'
    );
  }
  
  return data;
}

export const apiClient = {
  async getEvents(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_URL}/api/events?${queryParams.toString()}`);
    const result = await handleResponse<Event[]>(response);
    return result.data || [];
  },

  async getEvent(id: string, userId: string): Promise<Event> {
    const response = await fetch(`${API_URL}/api/events/${id}?userId=${userId}`);
    const result = await handleResponse<Event>(response);
    if (!result.data) throw new Error('Event not found');
    return result.data;
  },

  async createEvent(event: EventInput, userId: string): Promise<Event> {
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...event, userId }),
    });
    const result = await handleResponse<Event>(response);
    if (!result.data) throw new Error('Failed to create event');
    return result.data;
  },

  async updateEvent(id: string, event: Partial<EventInput>, userId: string): Promise<Event> {
    const response = await fetch(`${API_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...event, userId }),
    });
    const result = await handleResponse<Event>(response);
    if (!result.data) throw new Error('Failed to update event');
    return result.data;
  },

  async deleteEvent(id: string, userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/events/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    await handleResponse<void>(response);
  },
};

