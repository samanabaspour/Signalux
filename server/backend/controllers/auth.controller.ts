import { Router, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { authService } from '../services/auth.service';
import { LoginDto, RefreshTokenDto } from '../dto/auth.dto';
import { authenticateJwt, AuthenticatedRequest } from '../common/guards';
import { rateLimiter } from '../common/middleware';
import { AppError } from '../common/types';

export const authRouter = Router();

/**
 * POST /api/v1/auth/login
 */
authRouter.post('/login', rateLimiter(10, 60 * 1000), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const dto = plainToInstance(LoginDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.map(e => Object.values(e.constraints || {}).join(' - ')).join(' | ');
      throw new AppError(messages, 400, 'VALIDATION_ERROR', errors);
    }

    const result = await authService.login(dto, {
      ipAddress: req.ip || (req.headers['x-forwarded-for'] as string),
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/refresh
 */
authRouter.post('/refresh', rateLimiter(20, 60 * 1000), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const dto = plainToInstance(RefreshTokenDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new AppError('توکن بازیابی ارسالی معتبر نیست.', 400, 'VALIDATION_ERROR');
    }

    const result = await authService.refreshToken(dto, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/logout
 */
authRouter.post('/logout', authenticateJwt, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (req.user) {
      await authService.logout(req.user.id, req.sessionId);
    }
    res.json({
      success: true,
      data: { message: 'با موفقیت از حساب کاربری خارج شدید.' },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/logout-all
 */
authRouter.post('/logout-all', authenticateJwt, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (req.user) {
      await authService.logoutAll(req.user.id);
    }
    res.json({
      success: true,
      data: { message: 'تمامی نشست‌های فعال شما با موفقیت باطل شدند.' },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/auth/me
 */
authRouter.get('/me', authenticateJwt, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
});
