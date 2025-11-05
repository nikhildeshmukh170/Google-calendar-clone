import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import eventsRouter from './routes/events';
import usersRouter from './routes/users';
import { prisma } from './lib/prisma';
import { rateLimiter, contentTypeValidator } from './lib/middleware/apiMiddleware';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(rateLimiter);
app.use(contentTypeValidator);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug route to check database status
app.get('/debug/db', async (req, res) => {
  try {
    const dbInfo: any = {
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        PWD: process.cwd(),
      },
      sqlite: null,
      tables: null,
    };

    // Check SQLite file if using file:// URL
    if (process.env.DATABASE_URL?.startsWith('file:')) {
      const filePath = process.env.DATABASE_URL.replace(/^file:\/\//, '').replace(/^file:/, '');
      const resolved = path.resolve(filePath);
      const exists = fs.existsSync(resolved);
      
      dbInfo.sqlite = {
        resolvedPath: resolved,
        exists,
        size: exists ? fs.statSync(resolved).size : null,
        permissions: exists ? fs.statSync(resolved).mode.toString(8) : null
      };
    }

    // Test table query
    try {
      await prisma.user.findFirst({ take: 1 });
      dbInfo.tables = { user: true };
    } catch (e: any) {
      dbInfo.tables = { 
        error: e.message,
        code: e.code,
        meta: e.meta
      };
    }

    res.json({
      success: true,
      debug: dbInfo
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Root / - provide a simple helpful response for deployments (Render, Heroku, etc.)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Google Calendar Clone Backend',
    info: 'Available routes: /health, /api/users, /api/events',
    health: '/health',
    apiBase: '/api',
  });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

