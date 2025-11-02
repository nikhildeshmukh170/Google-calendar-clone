export interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  allDay: boolean;
  color: string;
  location: string | null;
  recurrence: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  color?: string;
  location?: string | null;
  recurrence?: string | null;
  completed?: boolean;
  completedAt?: string | null;
}


