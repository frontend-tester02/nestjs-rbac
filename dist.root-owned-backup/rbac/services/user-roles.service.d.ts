import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AssignUserRolesDto } from '../dto';
import { UpsertUserPermissionOverrideDto } from '../dto/upsert-user-permission-override.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { AuditLogService } from './audit-log.service';
import { CacheInvalidationService } from './cache-invalidation.service';
export declare class UserRolesService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly permissionRepository;
    private readonly userPermissionRepository;
    private readonly userRoleRepository;
    private readonly cacheInvalidationService;
    private readonly auditLogService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, permissionRepository: Repository<Permission>, userPermissionRepository: Repository<UserPermission>, userRoleRepository: Repository<UserRole>, cacheInvalidationService: CacheInvalidationService, auditLogService: AuditLogService);
    findUserRoles(userId: string): Promise<Role[]>;
    assignRoles(userId: string, dto: AssignUserRolesDto, assignedByUserId: string): Promise<Role[]>;
    removeRole(userId: string, roleId: string, actorId: string): Promise<void>;
    upsertPermissionOverride(userId: string, dto: UpsertUserPermissionOverrideDto): Promise<UserPermission>;
    findEffectivePermissions(userId: string): Promise<Permission[]>;
    private findUserById;
    private ensureUserExists;
}
