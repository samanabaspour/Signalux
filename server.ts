import express from 'express';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import publicRouter from './server/routes/public';
import adminRouter from './server/routes/admin';
import ticketsRouter, { adminTicketsRouter } from './server/routes/tickets';
import { config, hasAuthSecrets } from './server/backend/config';

import { prismaService } from './server/backend/services/prisma.service';
import { requestIdMiddleware, errorHandlerMiddleware } from './server/backend/common/middleware';
import { healthRouter } from './server/backend/controllers/health.controller';
import { authRouter } from './server/backend/controllers/auth.controller';
import { usersRouter } from './server/backend/controllers/users.controller';
import { rolesRouter } from './server/backend/controllers/roles.controller';
import { swaggerRouter } from './server/backend/controllers/swagger.controller';
import { buildSitemap, renderSitePage, resolvePage, siteRobots } from './server/siteSeo';
import { ROUTE_PATHS } from './src/utils/router';

async function startServer() {
  const app = express();
  const host = process.env.HOST || '127.0.0.1';
  if (config.env === 'production' && (!config.databaseUrl || !hasAuthSecrets())) {
    throw new Error('DATABASE_URL and two different JWT secrets of at least 64 characters are required.');
  }
  if (config.databaseUrl) await prismaService.connect();
  app.disable('x-powered-by');

  // Global Middlewares
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    if (/^\/api\/v1\/(auth|admin|tickets|users|roles)(?:\/|$)/.test(req.path)) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });

  // API v1 Routers
  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/roles', rolesRouter);
  if (config.env !== 'production') app.use('/api/v1', swaggerRouter);

  // Public & Admin legacy API Routes for frontend compatibility
  app.use('/api/v1/public', publicRouter);
  app.use('/api/v1/admin/tickets', adminTicketsRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/tickets', ticketsRouter);

  // Health check endpoint fallback
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/robots.txt', (_req, res) => res.type('text/plain').send(siteRobots()));
  app.get('/sitemap.xml', (_req, res) => res.type('application/xml').send(buildSitemap().sitemapXml));
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, error: { code: 'ROUTE_NOT_FOUND', message: 'مسیر API پیدا نشد.' } });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'client');
    const pageTemplate = await readFile(path.join(distPath, 'index.html'), 'utf8');
    app.get('/index.html', (_req, res) => res.redirect(301, '/'));
    app.use(express.static(distPath, { index: false, redirect: false }));
    app.use('/assets', (_req, res) => res.status(404).type('text/plain').send('Asset not found.'));
    app.get('*', (req, res) => {
      const page = resolvePage(req.path);
      if (page && page.path !== req.path) {
        const queryAt = req.originalUrl.indexOf('?');
        const query = queryAt >= 0 ? req.originalUrl.slice(queryAt) : '';
        return res.redirect(301, page.path + query);
      }
      if (page?.noIndex) res.setHeader('X-Robots-Tag', 'noindex, follow');
      if (page?.path === ROUTE_PATHS.admin || page?.path === ROUTE_PATHS.account) res.setHeader('Cache-Control', 'no-store');
      res.status(page ? 200 : 404).type('html').send(renderSitePage(pageTemplate, page));
    });
  }

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  app.listen(config.port, host, () => {
    console.log(`[Signalux Backend] Server running on http://${host}:${config.port}`);
  });
}

startServer().catch((err) => {
  console.error('[Signalux Backend] Failed to start server:', err);
  process.exitCode = 1;
});

