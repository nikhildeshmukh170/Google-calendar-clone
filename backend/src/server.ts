import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events';
import usersRouter from './routes/users';
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

