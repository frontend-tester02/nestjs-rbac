import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRole } from '../entities/user-role.entity';
export declare class AccessCheckService {
    private readonly cacheManager;
    private readonly userRoleRepository;
    private readonly userPermissionRepository;
    private readonly logger;
    constructor(cacheManager: Cache, userRoleRepository: Repository<UserRole>, userPermissionRepository: Repository<UserPermission>);
    hasAccess(userId: string, permission: string): Promise<boolean>;
    hasBulkAccess(userId: string, permissions: string[]): Promise<Record<string, boolean>>;
    private getEffectivePermissionNames;
    private getEffectivePermissionNamesFromDb;
    private getCachedPermissions;
    private cachePermissions;
    private getUserPermissionsKey;
}
