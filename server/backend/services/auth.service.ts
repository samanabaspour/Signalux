import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prismaService } from './prisma.service';
import { auditLogService } from './audit-log.service';
import { rbacService } from './rbac.service';
import { hashPassword, verifyPassword, hashToken, normalizeEmail } from '../common/utils/security';
import { AppError, AuthenticatedUser, JwtPayload } from '../common/types';
import { LoginDto, RefreshTokenDto } from '../dto/auth.dto';

// In-memory fallback state when database is connecting/not populated
const MEMORY_USERS: Map<string, any> = new Map();
const MEMORY_SESSIONS: Map<string, any> = new Map();

// Initialize memory super admin fallback
(async () => {
  const adminEmail = config.initialAdmin.email;
  const adminPasswordHash = await hashPassword(config.initialAdmin.password);
  MEMORY_USERS.set(adminEmail, {
    id: '00000000-0000-0000-0000-000000000001',
    firstName: config.initialAdmin.firstName,
    lastName: config.initialAdmin.lastName,
    email: adminEmail,
    phone: '۰۹۱۲۰۰۰۰۰۰۰',
    passwordHash: adminPasswordHash,
    status: 'ACTIVE',
    isEmailVerified: true,
    roles: ['SUPER_ADMIN'],
  });
})();

class AuthService {
  /**
   * Login user with email & password, returning JWT access & refresh tokens
   */
  public async login(
    dto: LoginDto,
    meta?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
    const email = normalizeEmail(dto.email);

    let user: any = null;
    let isDb = false;

    if (prismaService.status) {
      user = await prismaService.prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: { role: true },
          },
        },
      });
      if (user) isDb = true;
    }

    if (!user) {
      user = MEMORY_USERS.get(email);
    }

    // Generic invalid credentials message to prevent user enumeration
    if (!user) {
      throw new AppError('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
    }

    // Check status
    if (user.status === 'SUSPENDED' || user.status === 'INACTIVE') {
      throw new AppError('حساب کاربری شما غیرفعال یا معلق شده است.', 403, 'ACCOUNT_DISABLED');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
    }

    // Get RBAC context
    const rbacContext = await rbacService.getUserAuthContext(user.id);

    // Create session / refresh token record
    const refreshTokenPlain = jwt.sign(
      { sub: user.id, type: 'refresh' },
      config.jwt.refreshSecret,
      { expiresIn: '7d' }
    );
    const tokenHashStr = hashToken(refreshTokenPlain);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let sessionId = 'memory-session-' + Date.now();

    if (isDb) {
      const sessionRecord = await prismaService.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: tokenHashStr,
          expiresAt,
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        },
      });
      sessionId = sessionRecord.id;

      // Update last login
      await prismaService.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } else {
      MEMORY_SESSIONS.set(tokenHashStr, {
        id: sessionId,
        userId: user.id,
        expiresAt,
        revokedAt: null,
      });
    }

    // Sign Access Token
    const accessToken = jwt.sign(
      { sub: user.id, sessionId, type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '15m' }
    );

    // Write audit log
    await auditLogService.log({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    const safeUser: AuthenticatedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || null,
      avatar: user.avatar || null,
      roles: rbacContext.roles,
      permissions: rbacContext.permissions,
    };

    return {
      accessToken,
      refreshToken: refreshTokenPlain,
      user: safeUser,
    };
  }

  /**
   * Rotate Refresh Token and generate new Access Token
   */
  public async refreshToken(
    dto: RefreshTokenDto,
    meta?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: any;
    try {
      payload = jwt.verify(dto.refreshToken, config.jwt.refreshSecret);
    } catch {
      throw new AppError('توکن بازیابی منقضی شده یا معتبر نیست.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const tokenHashStr = hashToken(dto.refreshToken);

    if (prismaService.status) {
      const existingToken = await prismaService.prisma.refreshToken.findUnique({
        where: { tokenHash: tokenHashStr },
      });

      if (!existingToken || existingToken.revokedAt || existingToken.expiresAt < new Date()) {
        throw new AppError('توکن بازیابی منقضی یا باطل شده است.', 401, 'TOKEN_EXPIRED');
      }

      // Token Rotation: Revoke current refresh token and issue new pair
      await prismaService.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { revokedAt: new Date() },
      });

      const newRefreshToken = jwt.sign(
        { sub: payload.sub, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
      );
      const newTokenHash = hashToken(newRefreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const newSession = await prismaService.prisma.refreshToken.create({
        data: {
          userId: payload.sub,
          tokenHash: newTokenHash,
          expiresAt,
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        },
      });

      const accessToken = jwt.sign(
        { sub: payload.sub, sessionId: newSession.id, type: 'access' },
        config.jwt.accessSecret,
        { expiresIn: '15m' }
      );

      return { accessToken, refreshToken: newRefreshToken };
    } else {
      const memorySession = MEMORY_SESSIONS.get(tokenHashStr);
      if (!memorySession || memorySession.revokedAt) {
        throw new AppError('توکن بازیابی معتبر نیست.', 401, 'INVALID_REFRESH_TOKEN');
      }

      const newRefreshToken = jwt.sign(
        { sub: payload.sub, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
      );
      const newHash = hashToken(newRefreshToken);
      memorySession.revokedAt = new Date();

      MEMORY_SESSIONS.set(newHash, {
        id: 'memory-session-' + Date.now(),
        userId: payload.sub,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
      });

      const accessToken = jwt.sign(
        { sub: payload.sub, sessionId: memorySession.id, type: 'access' },
        config.jwt.accessSecret,
        { expiresIn: '15m' }
      );

      return { accessToken, refreshToken: newRefreshToken };
    }
  }

  /**
   * Revoke current session / refresh token
   */
  public async logout(userId: string, sessionId?: string): Promise<void> {
    if (prismaService.status && sessionId) {
      await prismaService.prisma.refreshToken.updateMany({
        where: { id: sessionId, userId },
        data: { revokedAt: new Date() },
      });
    }

    await auditLogService.log({
      userId,
      action: 'USER_LOGOUT',
      entityType: 'User',
      entityId: userId,
    });
  }

  /**
   * Revoke ALL active sessions for a user (security feature)
   */
  public async logoutAll(userId: string): Promise<void> {
    if (prismaService.status) {
      await prismaService.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await auditLogService.log({
      userId,
      action: 'USER_LOGOUT_ALL',
      entityType: 'User',
      entityId: userId,
    });
  }

  /**
   * Fetch details of currently logged in user from access token
   */
  public async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    let user: any = null;

    if (prismaService.status) {
      user = await prismaService.prisma.user.findUnique({
        where: { id: userId },
      });
    }

    if (!user) {
      for (const u of MEMORY_USERS.values()) {
        if (u.id === userId) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      throw new AppError('کاربر یافت نشد.', 404, 'USER_NOT_FOUND');
    }

    const rbacContext = await rbacService.getUserAuthContext(userId);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || null,
      avatar: user.avatar || null,
      roles: rbacContext.roles,
      permissions: rbacContext.permissions,
    };
  }

  /**
   * Verify access token and return payload
   */
  public verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    } catch {
      throw new AppError('توکن احراز هویت منقضی شده یا معتبر نیست.', 401, 'UNAUTHORIZED');
    }
  }
}

export const authService = new AuthService();
