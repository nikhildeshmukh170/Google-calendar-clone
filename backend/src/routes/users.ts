import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(200, 'Email must be less than 200 characters'),
});

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check if User model exists in Prisma client
    if (!prisma.user) {
      console.error('❌ Prisma User model not found. Please regenerate Prisma client: npx prisma generate');
      return res.status(500).json({
        success: false,
        error: 'Database client not properly initialized. Please restart the server after running: npx prisma generate',
      });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch users',
    });
  }
});

// GET /api/users/:id - Get a specific user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Check if User model exists in Prisma client
    if (!prisma.user) {
      console.error('❌ Prisma User model not found. Please regenerate Prisma client: npx prisma generate');
      return res.status(500).json({
        success: false,
        error: 'Database client not properly initialized. Please restart the server after running: npx prisma generate',
      });
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user',
    });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check if User model exists in Prisma client
    if (!prisma.user) {
      console.error('❌ Prisma User model not found. Please regenerate Prisma client: npx prisma generate');
      return res.status(500).json({
        success: false,
        error: 'Database client not properly initialized. Please restart the server after running: npx prisma generate',
      });
    }

    const validationResult = userSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { name, email } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.json({
        success: true,
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt,
        },
        message: 'User already exists',
      });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create user',
    });
  }
});

export default router;

