import { Router, Request, Response } from 'express';
import { prismaService } from '../services/prisma.service';

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Production health status check
 */
healthRouter.get('/', async (req: Request, res: Response) => {
  const isDbConnected = prismaService.status;

  res.json({
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: isDbConnected ? 'CONNECTED' : 'DISCONNECTED_MEMORY_FALLBACK',
        provider: 'mysql',
      },
      version: '1.0.0',
    },
  });
});
