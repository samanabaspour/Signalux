import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config, hasAuthSecrets } from '../config';
import { AppError } from '../common/types';
import { hashPassword } from '../common/utils/security';
import { authService } from './auth.service';
import { prismaService } from './prisma.service';

const GOOGLE_CERTS = 'https://www.googleapis.com/oauth2/v1/certs';
const SMS_ENDPOINT = 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber';
const OTP_SECONDS = 300;
const OTP_RETRY_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;
type RequestMetadata = { ipAddress?: string; userAgent?: string };
let certificateCache: { values: Record<string, string>; until: number } | undefined;

function backendReady() {
  return hasAuthSecrets() && prismaService.status;
}

export function customerAuthOptions() {
  const id = (process.env.GOOGLE_CLIENT_ID || '').trim();
  return {
    password: backendReady(),
    google: backendReady() && /^[a-z0-9-]+\.apps\.googleusercontent\.com$/.test(id) ? id : '',
    sms: backendReady() && Boolean(process.env.MELIPAYAMAK_USERNAME && process.env.MELIPAYAMAK_PASSWORD
      && /^[1-9]\d*$/.test(process.env.MELIPAYAMAK_PATTERN_ID ?? '')),
  };
}

function database(method: 'google' | 'sms') {
  if (!customerAuthOptions()[method]) {
    throw new AppError('این روش ورود در این محیط پیکربندی نشده است.', 503, 'AUTH_METHOD_UNAVAILABLE');
  }
  return prismaService.prisma;
}

export function normalizeDigits(value: unknown) {
  return typeof value === 'string'
    ? value.trim().replace(/[۰-۹٠-٩]/g, character =>
      String(character.charCodeAt(0) - (character.charCodeAt(0) >= 0x6f0 ? 0x6f0 : 0x660)))
    : '';
}

function normalizePhone(value: unknown) {
  const phone = normalizeDigits(value).replace(/[\s-]/g, '').replace(/^(?:\+98|0098)/, '0');
  if (!/^09\d{9}$/.test(phone)) {
    throw new AppError('شمارهٔ موبایل معتبر وارد کنید.', 400, 'INVALID_PHONE');
  }
  return phone;
}

function proof(value: string) {
  return createHmac('sha256', config.jwt.refreshSecret).update(value).digest('hex');
}

function isUniqueError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function invalidCode() {
  return new AppError('کد نادرست یا منقضی شده است. در صورت نیاز کد جدید بگیرید.', 401, 'INVALID_OTP');
}

async function providerJson(url: string, init?: RequestInit): Promise<unknown> {
  try {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(8000), redirect: 'error' });
    if (response.ok) return await response.json();
  } catch {
    // Provider errors may contain credentials, request bodies or phone numbers.
  }
  throw new AppError('ارتباط با سرویس ورود برقرار نشد. دوباره تلاش کنید.', 502, 'AUTH_PROVIDER_UNAVAILABLE');
}

async function googleCertificates(): Promise<Record<string, string>> {
  if (certificateCache && certificateCache.until > Date.now()) return certificateCache.values;
  const values = await providerJson(GOOGLE_CERTS);
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    throw new AppError('کلیدهای سرویس گوگل در دسترس نیست.', 502, 'GOOGLE_KEYS_UNAVAILABLE');
  }
  certificateCache = { values: values as Record<string, string>, until: Date.now() + 600_000 };
  return certificateCache.values;
}

export async function createGoogleChallenge(meta: RequestMetadata) {
  const db = database('google');
  const nonce = randomBytes(24).toString('hex');
  await db.customerAuthChallenge.create({ data: {
    id: nonce, kind: 'google', subject: nonce, rateKey: 'google:' + nonce,
    proofHash: proof('google:' + nonce), ipKey: proof('ip:' + (meta.ipAddress || '')),
    createdAt: new Date(), expiresAt: new Date(Date.now() + 600_000),
  } });
  return { clientId: customerAuthOptions().google, nonce };
}

export async function signInWithGoogle(credential: unknown, meta: RequestMetadata) {
  const db = database('google');
  const invalid = new AppError('پاسخ ورود گوگل معتبر نیست. دوباره تلاش کنید.', 401, 'INVALID_GOOGLE_CREDENTIAL');
  if (typeof credential !== 'string' || credential.length > 8192) throw invalid;
  const decoded = jwt.decode(credential, { complete: true });
  if (!decoded || decoded.header.alg !== 'RS256' || typeof decoded.header.kid !== 'string') throw invalid;
  const nonce = typeof decoded.payload === 'object' ? decoded.payload.nonce : undefined;
  if (typeof nonce !== 'string' || !/^[a-f0-9]{48}$/.test(nonce)) throw invalid;
  const attempted = await db.customerAuthChallenge.updateMany({
    where: { id: nonce, kind: 'google', consumedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: 5 } },
    data: { attempts: { increment: 1 } },
  });
  if (attempted.count !== 1) throw invalid;
  const keys = await googleCertificates();
  const key = Object.hasOwn(keys, decoded.header.kid) ? keys[decoded.header.kid] : undefined;
  if (typeof key !== 'string') throw invalid;
  let identity: JwtPayload;
  try {
    const payload = jwt.verify(credential, key, {
      algorithms: ['RS256'], audience: customerAuthOptions().google,
      issuer: ['accounts.google.com', 'https://accounts.google.com'], maxAge: '10m',
    });
    if (typeof payload === 'string') throw invalid;
    identity = payload;
  } catch {
    throw invalid;
  }
  if (typeof identity.exp !== 'number' || typeof identity.nonce !== 'string' || !/^[a-f0-9]{48}$/.test(identity.nonce)
    || typeof identity.sub !== 'string' || !/^[\w-]{1,191}$/.test(identity.sub)
    || identity.email_verified !== true || typeof identity.email !== 'string'
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email) || identity.email.length > 191
    || identity.email.toLowerCase().endsWith('@signin.invalid')) throw invalid;

  const consumed = await db.customerAuthChallenge.updateMany({
    where: { id: identity.nonce, kind: 'google', consumedAt: null, expiresAt: { gt: new Date() } },
    data: { consumedAt: new Date() },
  });
  if (consumed.count !== 1) throw invalid;

  const subject = identity.sub;
  const email = identity.email.toLowerCase();
  let user = await db.user.findUnique({ where: { googleSubject: subject } });
  if (!user) {
    try {
      user = await db.user.create({ data: {
        googleSubject: subject, email, isEmailVerified: true,
        firstName: validName(identity.given_name) || 'کاربر', lastName: validName(identity.family_name),
        passwordHash: await hashPassword(randomBytes(32).toString('hex')),
      } });
    } catch (error) {
      if (!isUniqueError(error)) throw error;
      user = await db.user.findUnique({ where: { googleSubject: subject } });
      if (!user) throw new AppError('این ایمیل از قبل حساب دارد. با روش قبلی وارد شوید.', 409, 'EMAIL_ALREADY_REGISTERED');
    }
  }
  return authService.createSession(user.id, meta);
}

export async function sendCustomerOtp(value: unknown, meta: RequestMetadata) {
  const db = database('sms');
  const phone = normalizePhone(value);
  const time = Date.now();
  const ipKey = proof('ip:' + (meta.ipAddress || ''));
  const [phoneCount, ipCount, recent] = await Promise.all([
    db.customerAuthChallenge.count({ where: { kind: 'sms', subject: phone, createdAt: { gt: new Date(time - 3600_000) } } }),
    db.customerAuthChallenge.count({ where: { kind: 'sms', ipKey, createdAt: { gt: new Date(time - 3600_000) } } }),
    db.customerAuthChallenge.findFirst({ where: { kind: 'sms', subject: phone, createdAt: { gt: new Date(time - 60_000) } }, select: { id: true } }),
  ]);
  const limited = new AppError('درخواست‌های پیامک بیش از حد است. کمی بعد تلاش کنید.', 429, 'OTP_RATE_LIMIT');
  if (recent || phoneCount >= 5 || ipCount >= 20) throw limited;

  const id = randomBytes(24).toString('hex');
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  try {
    await db.customerAuthChallenge.create({ data: {
      id, kind: 'sms', subject: phone, ipKey, rateKey: 'sms:' + phone + ':' + Math.floor(time / 60_000),
      proofHash: proof('sms:' + id + ':' + code), expiresAt: new Date(time + OTP_SECONDS * 1000),
      createdAt: new Date(time),
      // Activate the challenge only when the SMS gateway accepts it.
      consumedAt: new Date(time),
    } });
  } catch (error) {
    if (isUniqueError(error)) throw limited;
    throw error;
  }

  const result = await providerJson(SMS_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({
      username: process.env.MELIPAYAMAK_USERNAME!,
      password: process.env.MELIPAYAMAK_PASSWORD!,
      bodyId: process.env.MELIPAYAMAK_PATTERN_ID!,
      to: phone, text: code,
    }),
  }) as { RetStatus?: unknown; Value?: unknown } | null;
  if (String(result?.RetStatus) !== '1' || !/^[1-9]\d{6,}$/.test(String(result?.Value))) {
    throw new AppError('سرویس پیامک درخواست را نپذیرفت.', 502, 'SMS_NOT_ACCEPTED');
  }
  await db.customerAuthChallenge.update({ where: { id }, data: { consumedAt: null } });
  return { challengeId: id, expiresIn: OTP_SECONDS, retryAfter: OTP_RETRY_SECONDS };
}

function validName(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 80) : '';
}

export async function verifyCustomerOtp(
  input: { challengeId?: unknown; code?: unknown; firstName?: unknown; lastName?: unknown },
  meta: RequestMetadata,
) {
  const db = database('sms');
  const id = input.challengeId;
  const code = normalizeDigits(input.code);
  if (typeof id !== 'string' || !/^[a-f0-9]{48}$/.test(id) || !/^\d{6}$/.test(code)) throw invalidCode();
  const eligible = { id, kind: 'sms', consumedAt: null, expiresAt: { gt: new Date() } };
  const attempted = await db.customerAuthChallenge.updateMany({
    where: { ...eligible, attempts: { lt: MAX_OTP_ATTEMPTS } }, data: { attempts: { increment: 1 } },
  });
  if (attempted.count !== 1) throw invalidCode();
  const challenge = await db.customerAuthChallenge.findUniqueOrThrow({ where: { id } });
  const expected = Buffer.from(challenge.proofHash, 'hex');
  const submitted = Buffer.from(proof('sms:' + id + ':' + code), 'hex');
  if (!timingSafeEqual(expected, submitted)) throw invalidCode();
  const consumed = await db.customerAuthChallenge.updateMany({ where: eligible, data: { consumedAt: new Date() } });
  if (consumed.count !== 1) throw invalidCode();
  const phone = challenge.subject;
  let user = await db.user.findUnique({ where: { verifiedPhone: phone } });
  if (!user) {
    try {
      user = await db.user.create({ data: {
        verifiedPhone: phone, phone, email: phone + '@signin.invalid',
        firstName: validName(input.firstName) || 'کاربر', lastName: validName(input.lastName),
        passwordHash: await hashPassword(randomBytes(32).toString('hex')),
      } });
    } catch (error) {
      if (!isUniqueError(error)) throw error;
      user = await db.user.findUniqueOrThrow({ where: { verifiedPhone: phone } });
    }
  }
  return authService.createSession(user.id, meta);
}
