import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import publicRouter from './server/routes/public';
import adminRouter from './server/routes/admin';
import ticketsRouter from './server/routes/tickets';

import { prismaService } from './server/backend/services/prisma.service';
import { requestIdMiddleware, errorHandlerMiddleware } from './server/backend/common/middleware';
import { healthRouter } from './server/backend/controllers/health.controller';
import { authRouter } from './server/backend/controllers/auth.controller';
import { usersRouter } from './server/backend/controllers/users.controller';
import { rolesRouter } from './server/backend/controllers/roles.controller';
import { swaggerRouter } from './server/backend/controllers/swagger.controller';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Attempt database connection asynchronously
  prismaService.connect().catch(() => {
    console.warn('[Signalux Backend] Continuing with memory fallback engine.');
  });

  // Global Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // API v1 Routers
  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/roles', rolesRouter);
  app.use('/api/v1', swaggerRouter);

  // Public & Admin legacy API Routes for frontend compatibility
  app.use('/api/v1/public', publicRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/tickets', ticketsRouter);

  // Health check endpoint fallback
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Signalux Backend] Production Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Signalux Backend] Failed to start server:', err);
});

