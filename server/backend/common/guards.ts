import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AppError, AuthenticatedUser } from './types';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  sessionId?: string;
  correlationId?: string;
}

/**
 * JWT Authentication Middleware Guard
 */
export async function authenticateJwt(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('توکن دسترسی ارسال نشده است. لطفاً ابتدا وارد شوید.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const token = authHeader.split(' ')[1];
    const payload = authService.verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new AppError('نوع توکن نامعتبر است.', 401, 'INVALID_TOKEN');
    }

    const currentUser = await authService.getCurrentUser(payload.sub, payload.sessionId);
    req.user = currentUser;
    req.sessionId = payload.sessionId;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * RBAC Permission Authorization Guard Middleware Factory
 */
export function requirePermissions(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('احراز هویت انجام نشده است.', 401, 'UNAUTHORIZED'));
    }

    const userRoles = req.user.roles || [];
    const userPermissions = req.user.permissions || [];

    // Super Admin bypasses all explicit permission checks
    if (userRoles.includes('SUPER_ADMIN')) {
      return next();
    }

    const hasAll = requiredPermissions.every(perm => userPermissions.includes(perm));
    if (!hasAll) {
      return next(
        new AppError(
          'شما سطح دسترسی لازم برای انجام این عملیات را ندارید.',
          403,
          'PERMISSION_DENIED',
          { requiredPermissions }
        )
      );
    }

    next();
  };
}

/**
 * Role Authorization Guard Middleware Factory
 */
export function requireRoles(...requiredRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('احراز هویت انجام نشده است.', 401, 'UNAUTHORIZED'));
    }

    const userRoles = req.user.roles || [];

    if (userRoles.includes('SUPER_ADMIN')) {
      return next();
    }

    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return next(
        new AppError(
          'نقش کاربری شما اجازه دسترسی به این بخش را ندارد.',
          403,
          'ROLE_ACCESS_DENIED',
          { requiredRoles }
        )
      );
    }

    next();
  };
}
