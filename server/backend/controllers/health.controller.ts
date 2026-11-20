import { Router, Request, Response } from 'express';
import { prismaService } from '../services/prisma.service';

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Production health status check
 */
healthRouter.get('/', async (req: Request, res: Response) => {
  const isDbConnected = prismaService.status;

  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    data: {
      status: isDbConnected ? 'UP' : 'NOT_READY',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
        provider: 'mysql',
      },
      version: '1.0.0',
    },
  });
});
