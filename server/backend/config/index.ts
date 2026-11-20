import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  env: string;
  port: number;
  databaseUrl: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  security: {
    corsOrigin: string;
    cookieDomain: string;
    cookieSecure: boolean;
    rateLimitTtl: number;
    rateLimitLimit: number;
  };
  initialAdmin: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
}

export const config: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || 'mysql://soheils4_signalux:bCe26jbu9qXAtmDGZ4dN@localhost:3306/soheils4_signalux',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'signalux_jwt_access_secret_production_2026_super_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'signalux_jwt_refresh_secret_production_2026_super_key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN || '*',
    cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    rateLimitLimit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),
  },
  initialAdmin: {
    email: (process.env.INITIAL_ADMIN_EMAIL || 'admin@signalux.ir').trim().toLowerCase(),
    password: process.env.INITIAL_ADMIN_PASSWORD || 'SignaluxSuperAdmin2026!',
    firstName: process.env.INITIAL_ADMIN_FIRST_NAME || 'مدیر',
    lastName: process.env.INITIAL_ADMIN_LAST_NAME || 'ارشد',
  },
};
