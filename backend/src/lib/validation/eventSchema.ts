import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  allDay: z.boolean().default(false),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').default('#1a73e8'),
  location: z.string().max(200, 'Location must be less than 200 characters').optional().nullable(),
  recurrence: z.string().optional().nullable(),
  completed: z.boolean().default(false),
  completedAt: z.string().datetime().optional().nullable(),
  userId: z.string().min(1, 'UserId is required'),
});

export const updateEventSchema = eventSchema.partial();

export type EventInput = z.infer<typeof eventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

