import { NextFunction, Request, Router, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { authService } from '../services/auth.service';
import { LoginDto, RefreshTokenDto } from '../dto/auth.dto';
import { authenticateJwt, AuthenticatedRequest } from '../common/guards';
import { rateLimiter } from '../common/middleware';
import { AppError } from '../common/types';
import { createGoogleChallenge, customerAuthOptions, sendCustomerOtp, signInWithGoogle, verifyCustomerOtp } from '../services/customer-auth.service';

export const authRouter = Router();

authRouter.get('/options', (_req, res) => {
  const { password, google, sms } = customerAuthOptions();
  res.json({ success: true, data: { password, google: Boolean(google), sms } });
});

function customerAction(action: (body: any, meta: { ipAddress?: string; userAgent?: string }) => Promise<unknown>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.is('application/json')) throw new AppError('درخواست JSON لازم است.', 415, 'JSON_REQUIRED');
      const data = await action(req.body ?? {}, { ipAddress: req.ip, userAgent: req.get('User-Agent') });
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

authRouter.post('/google/challenge', rateLimiter(12), customerAction((_body, meta) => createGoogleChallenge(meta)));
authRouter.post('/google', rateLimiter(15), customerAction((body, meta) => signInWithGoogle(body.credential, meta)));
authRouter.post('/otp/send', rateLimiter(6), customerAction((body, meta) => sendCustomerOtp(body.phone, meta)));
authRouter.post('/otp/verify', rateLimiter(20), customerAction(verifyCustomerOtp));

/**
 * POST /api/v1/auth/login
 */
authRouter.post('/login', rateLimiter(10, 60 * 1000), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const dto = plainToInstance(LoginDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.map(e => Object.values(e.constraints || {}).join(' - ')).join(' | ');
      throw new AppError(messages, 400, 'VALIDATION_ERROR');
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
