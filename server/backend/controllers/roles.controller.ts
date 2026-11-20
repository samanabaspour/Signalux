import { Router, Response } from 'express';
import { authenticateJwt, requirePermissions, AuthenticatedRequest } from '../common/guards';
import { prismaService } from '../services/prisma.service';
import { SYSTEM_ROLES, SYSTEM_PERMISSIONS } from '../services/rbac.service';

export const rolesRouter = Router();

rolesRouter.use(authenticateJwt);

/**
 * GET /api/v1/roles
 */
rolesRouter.get('/', requirePermissions('roles.view'), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (prismaService.status) {
      const dbRoles = await prismaService.prisma.role.findMany({
        include: {
          rolePermissions: {
            include: { permission: true }
          }
        }
      });

      if (dbRoles.length > 0) {
        const formatted = dbRoles.map(r => ({
          id: r.id,
          name: r.name,
          labelPersian: r.labelPersian,
          description: r.description,
          permissions: r.rolePermissions.map(rp => rp.permission.key)
        }));
        return res.json({ success: true, data: formatted });
      }
    }

    res.json({ success: true, data: SYSTEM_ROLES });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/permissions
 */
rolesRouter.get('/permissions', requirePermissions('roles.view'), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (prismaService.status) {
      const dbPerms = await prismaService.prisma.permission.findMany();
      if (dbPerms.length > 0) {
        return res.json({ success: true, data: dbPerms });
      }
    }

    res.json({ success: true, data: SYSTEM_PERMISSIONS });
  } catch (err) {
    next(err);
  }
});
