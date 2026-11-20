import { PrismaClient } from '@prisma/client';

class PrismaService {
  private client: PrismaClient | null = null;
  private isConnected = false;

  constructor() {
    try {
      this.client = new PrismaClient();
    } catch (err) {
      console.warn('Prisma client initialization deferred until database connection is configured.', err);
    }
  }

  public get prisma(): PrismaClient {
    if (!this.client) {
      this.client = new PrismaClient();
    }
    return this.client;
  }

  public async connect(): Promise<boolean> {
    try {
      if (!this.client) {
        this.client = new PrismaClient();
      }
      await this.client.$connect();
      this.isConnected = true;
      return true;
    } catch (err) {
      console.warn('PostgreSQL database connection unavailable. Falling back to memory state store.', (err as Error).message);
      this.isConnected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
    }
  }

  public get status(): boolean {
    return this.isConnected;
  }
}

export const prismaService = new PrismaService();
