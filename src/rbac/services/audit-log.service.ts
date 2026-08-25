import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

type RoleAuditAction = 'user_role.assigned' | 'user_role.removed';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logUserRoleChange(params: {
    actorId: string;
    action: RoleAuditAction;
    targetUserId: string;
    roleId: string;
  }): Promise<void> {
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        actorId: params.actorId,
        action: params.action,
        targetUserId: params.targetUserId,
        roleId: params.roleId,
      }),
    );
  }
}
