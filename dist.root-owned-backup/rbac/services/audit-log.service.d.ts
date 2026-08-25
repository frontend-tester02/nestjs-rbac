import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
type RoleAuditAction = 'user_role.assigned' | 'user_role.removed';
export declare class AuditLogService {
    private readonly auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    logUserRoleChange(params: {
        actorId: string;
        action: RoleAuditAction;
        targetUserId: string;
        roleId: string;
    }): Promise<void>;
}
export {};
