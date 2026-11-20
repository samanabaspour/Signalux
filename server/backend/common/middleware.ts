import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthenticatedRequest } from './guards';
import { AppError } from './types';

// Simple in-memory rate limiter for auth endpoints
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/**
 * Correlation ID middleware to attach unique request tracking ID
 */
export function requestIdMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.correlationId = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}

/**
 * Endpoint rate limiter middleware (especially for auth endpoints)
 */
export function rateLimiter(limit: number = 20, windowMs: number = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || record.expiresAt < now) {
      rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      return next(
        new AppError(
          'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.',
          429,
          'TOO_MANY_REQUESTS'
        )
      );
    }

    record.count += 1;
    next();
  };
}

/**
 * Global Error Handler Middleware
 */
export function errorHandlerMiddleware(
  err: any,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'خطای غیرمنتظره‌ای در سرور رخ داد.';
  const details = err.details || undefined;

  if (statusCode === 500) {
    console.error(`[SERVER_ERROR] [ReqId: ${req.correlationId || 'N/A'}]`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
      ...(req.correlationId ? { requestId: req.correlationId } : {}),
    },
  });
}
