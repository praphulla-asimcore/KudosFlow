import { prisma } from '@/lib/prisma';

interface AuditLogInput {
  userId?: string | null;
  userName?: string | null;
  action: string;
  module?: string;
  details?: string;
  ipAddress?: string;
}

export async function logAuditEvent(input: AuditLogInput) {
  try {
    await prisma.auditTrail.create({
      data: {
        userId: input.userId ?? null,
        userName: input.userName ?? 'System',
        action: input.action,
        module: input.module ?? null,
        details: input.details ?? null,
        ipAddress: input.ipAddress ?? null,
      },
    });
  } catch (e) {
    console.error('Audit log error:', e);
  }
}
