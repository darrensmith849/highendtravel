import { v4 as uuid } from 'uuid';
import type { AuditAction, AuditLog } from '@/types/database';

export async function logAuditEvent(params: {
  tenantId: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const log: AuditLog = {
    id: uuid(),
    tenant_id: params.tenantId,
    user_id: params.userId,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId,
    metadata: params.metadata || null,
    created_at: new Date().toISOString(),
  };

  // Store in memory (would be DB in production)
  if (!(_auditLogs)) {
    _auditLogs = [];
  }
  _auditLogs.push(log);
}

let _auditLogs: AuditLog[] = [];

export function getAuditLogs(tenantId: string): AuditLog[] {
  return _auditLogs.filter((l) => l.tenant_id === tenantId);
}

export function resetAuditLogs(): void {
  _auditLogs = [];
}
