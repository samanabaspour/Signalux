import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config, hasAuthSecrets } from '../config';
import { prismaService } from './prisma.service';
import { auditLogService } from './audit-log.service';
import { rbacService } from './rbac.service';
import { verifyPassword, hashToken, normalizeEmail } from '../common/utils/security';
import { AppError, AuthenticatedUser, JwtPayload } from '../common/types';
import { LoginDto, RefreshTokenDto } from '../dto/auth.dto';

type RequestMetadata = { ipAddress?: string; userAgent?: string };

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_SECONDS = 7 * 24 * 60 * 60;

function requireAuthDatabase() {
  if (!hasAuthSecrets() || !prismaService.status) {
    throw new AppError('سرویس ورود موقتاً در دسترس نیست.', 503, 'AUTH_UNAVAILABLE');
  }
  return prismaService.prisma;
}

function issueTokens(userId: string) {
  const sessionId = randomUUID();
  const accessToken = jwt.sign(
    { sub: userId, sessionId, type: 'access' }, config.jwt.accessSecret,
    { algorithm: 'HS256', expiresIn: ACCESS_TOKEN_SECONDS }
  );
  const refreshToken = jwt.sign(
    { sub: userId, sessionId, type: 'refresh' }, config.jwt.refreshSecret,
    { algorithm: 'HS256', expiresIn: REFRESH_TOKEN_SECONDS }
  );
  return {
    accessToken,
    refreshToken,
    session: {
      id: sessionId,
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_SECONDS * 1000),
    },
  };
}

function readToken(token: string, type: JwtPayload['type']): JwtPayload {
  const secret = type === 'access' ? config.jwt.accessSecret : config.jwt.refreshSecret;
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || payload.type !== type || typeof payload.sub !== 'string'
      || typeof payload.sessionId !== 'string' || typeof payload.exp !== 'number') {
      throw new Error('Invalid token claims');
    }
    return { sub: payload.sub, sessionId: payload.sessionId, type };
  } catch {
    throw new AppError('توکن احراز هویت منقضی شده یا معتبر نیست.', 401, 'UNAUTHORIZED');
  }
}

class AuthService {
  public async login(dto: LoginDto, meta?: RequestMetadata) {
    const db = requireAuthDatabase();
    const email = normalizeEmail(dto.email);
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new AppError('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
    }

    return this.createSession(user.id, meta);
  }

  public async createSession(userId: string, meta?: RequestMetadata) {
    const db = requireAuthDatabase();
    const profile = await this.getCurrentUser(userId);
    const tokens = issueTokens(userId);
    await db.$transaction([
      db.refreshToken.create({ data: { ...tokens.session, ...meta } }),
      db.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } }),
    ]);
    await auditLogService.log({
      userId, action: 'USER_LOGIN', entityType: 'User', entityId: userId,
      ...meta,
    });
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: profile };
  }

  public async refreshToken(dto: RefreshTokenDto, meta?: RequestMetadata) {
    const db = requireAuthDatabase();
    const payload = readToken(dto.refreshToken, 'refresh');
    const tokens = issueTokens(payload.sub);
    await db.$transaction(async tx => {
      const consumed = await tx.refreshToken.updateMany({
        where: {
          id: payload.sessionId,
          userId: payload.sub,
          tokenHash: hashToken(dto.refreshToken),
          revokedAt: null,
          expiresAt: { gt: new Date() },
          user: { status: 'ACTIVE' },
        },
        data: { revokedAt: new Date() },
      });
      if (consumed.count !== 1) {
        throw new AppError('نشست معتبر نیست.', 401, 'UNAUTHORIZED');
      }
      await tx.refreshToken.create({ data: { ...tokens.session, ...meta } });
    });
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  public async logout(userId: string, sessionId?: string): Promise<void> {
    if (!sessionId) return;
    await requireAuthDatabase().refreshToken.updateMany({
      where: { id: sessionId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await auditLogService.log({ userId, action: 'USER_LOGOUT', entityType: 'User', entityId: userId });
  }

  public async logoutAll(userId: string): Promise<void> {
    await requireAuthDatabase().refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await auditLogService.log({ userId, action: 'USER_LOGOUT_ALL', entityType: 'User', entityId: userId });
  }

  public async getCurrentUser(userId: string, sessionId?: string): Promise<AuthenticatedUser> {
    const db = requireAuthDatabase();
    const user = await db.user.findFirst({
      where: {
        id: userId,
        status: 'ACTIVE',
        ...(sessionId && { refreshTokens: { some: {
          id: sessionId, revokedAt: null, expiresAt: { gt: new Date() },
        } } }),
      },
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatar: true },
    });
    if (!user) {
      throw new AppError('حساب یا نشست معتبر نیست.', 401, 'UNAUTHORIZED');
    }
    if (user.email.endsWith('@signin.invalid')) user.email = '';
    return { ...user, ...await rbacService.getUserAuthContext(userId) };
  }

  public verifyAccessToken(token: string): JwtPayload {
    requireAuthDatabase();
    return readToken(token, 'access');
  }
}

export const authService = new AuthService();
