import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
export declare class CacheInvalidationService {
    private readonly cacheManager;
    private readonly userRoleRepository;
    private readonly logger;
    constructor(cacheManager: Cache, userRoleRepository: Repository<UserRole>);
    invalidateUserPermissions(userId: string): Promise<void>;
    invalidateRoleUsersPermissions(roleId: string): Promise<void>;
    private getUserPermissionsKey;
    private deleteCacheKey;
}
