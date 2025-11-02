import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { validate } from '../lib/validation/validate';
import { eventSchema, updateEventSchema } from '../lib/validation/eventSchema';
import { sanitizeString, formatEventResponse } from '../lib/utils/eventUtils';

const router = Router();

// GET /api/events - Get all events with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      userId,
      limit,
      offset,
      sortBy = 'startDate',
      sortOrder = 'asc',
    } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required',
      });
    }

    const where: any = {
      userId: userId as string,
    };

    if (startDate) {
      where.startDate = { gte: new Date(startDate as string) };
    }
    if (endDate) {
      where.endDate = { lte: new Date(endDate as string) };
    }

    const take = limit ? parseInt(limit as string, 10) : undefined;
    const skip = offset ? parseInt(offset as string, 10) : undefined;

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        take,
        skip,
        orderBy,
      }),
      prisma.event.count({ where }),
    ]);

    return res.json({
      success: true,
      data: events.map(formatEventResponse),
      meta: {
        total,
        limit: take,
        offset: skip,
      },
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch events',
    });
  }
});

// GET /api/events/:id - Get a specific event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required',
      });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    if (event.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    return res.json({
      success: true,
      data: formatEventResponse(event),
    });
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch event',
    });
  }
});

// POST /api/events - Create a new event
router.post('/', validate(eventSchema), async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId, ...rest } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required',
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date',
      });
    }

    const event = await prisma.event.create({
      data: {
        ...rest,
        userId,
        title: sanitizeString(rest.title) || 'Untitled Event',
        description: sanitizeString(rest.description),
        location: sanitizeString(rest.location),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        completedAt: rest.completed && rest.completedAt ? new Date(rest.completedAt) : null,
      },
    });

    return res.status(201).json({
      success: true,
      data: formatEventResponse(event),
      message: 'Event created successfully',
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create event',
    });
  }
});

// PUT /api/events/:id - Update an event
router.put('/:id', validate(updateEventSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, userId, ...rest } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required',
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    if (existingEvent.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const updateData: any = { ...rest };

    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date',
      });
    }

    if (rest.title) updateData.title = sanitizeString(rest.title) || 'Untitled Event';
    if (rest.description !== undefined) updateData.description = sanitizeString(rest.description);
    if (rest.location !== undefined) updateData.location = sanitizeString(rest.location);

    if (rest.completed !== undefined) {
      updateData.completed = rest.completed;
      updateData.completedAt = rest.completed ? (rest.completedAt ? new Date(rest.completedAt) : new Date()) : null;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      success: true,
      data: formatEventResponse(event),
      message: 'Event updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update event',
    });
  }
});

// DELETE /api/events/:id - Delete an event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required',
      });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    if (event.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    await prisma.event.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete event',
    });
  }
});

export default router;

