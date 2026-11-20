import { prismaService } from './prisma.service';

export interface AuditLogData {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

class AuditLogService {
  /**
   * Log administrative or security action to immutable database table
   */
  public async log(data: AuditLogData): Promise<void> {
    try {
      if (prismaService.status) {
        await prismaService.prisma.auditLog.create({
          data: {
            userId: data.userId || null,
            action: data.action,
            entityType: data.entityType,
            entityId: data.entityId || null,
            metadata: data.metadata || {},
            ipAddress: data.ipAddress || null,
            userAgent: data.userAgent || null,
          },
        });
      } else {
        console.log(`[AUDIT_LOG] Action: ${data.action} | Entity: ${data.entityType} | User: ${data.userId || 'system'}`);
      }
    } catch (err) {
      console.error('Failed to write audit log entry', err);
    }
  }
}

export const auditLogService = new AuditLogService();
