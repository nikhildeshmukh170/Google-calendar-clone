export const sanitizeString = (str: string | null | undefined): string | null => {
  if (!str) return null;
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
};

export const formatEventResponse = (event: any) => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    allDay: event.allDay,
    color: event.color,
    location: event.location,
    recurrence: event.recurrence,
    completed: event.completed,
    completedAt: event.completedAt,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};


