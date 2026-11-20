import { AppError } from '../common/types';
import { prismaService } from './prisma.service';

const selection = { id: true, gtmContainerId: true, gtmEnabled: true } as const;

function findSettings() {
  return prismaService.prisma.siteSettings.findFirst({
    select: selection,
    orderBy: { id: 'asc' },
  });
}

export async function readTagManagerSettings() {
  const settings = prismaService.status ? await findSettings() : null;
  return { gtmContainerId: settings?.gtmContainerId ?? '', gtmEnabled: settings?.gtmEnabled ?? false };
}

export async function saveTagManagerSettings(input: { gtmContainerId?: unknown; gtmEnabled?: unknown }) {
  const existing = await findSettings();
  const rawId = input.gtmContainerId === undefined ? existing?.gtmContainerId ?? '' : input.gtmContainerId;
  const enabled = input.gtmEnabled === undefined ? existing?.gtmEnabled ?? false : input.gtmEnabled;
  const id = typeof rawId === 'string' ? rawId.trim() : null;
  if (id === null || !/^(?:GTM-[A-Z0-9]{1,20})?$/.test(id) ||
    typeof enabled !== 'boolean' || (enabled && id === '')) {
    throw new AppError('شناسهٔ معتبر GTM برای فعال‌سازی لازم است.', 400, 'INVALID_GTM_SETTINGS');
  }
  const data = { gtmContainerId: id, gtmEnabled: enabled };
  const rowId = existing?.id ?? 'default-settings';
  await prismaService.prisma.siteSettings.upsert({
    where: { id: rowId },
    create: { id: rowId, ...data },
    update: data,
    select: { id: true },
  });
  return data;
}
