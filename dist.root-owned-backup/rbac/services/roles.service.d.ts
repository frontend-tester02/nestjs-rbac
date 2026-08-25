import { Repository } from 'typeorm';
import { AssignRolePermissionsDto, CreateRoleDto, PaginationQueryDto, UpdateRoleDto } from '../dto';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { CacheInvalidationService } from './cache-invalidation.service';
export declare class RolesService {
    private readonly roleRepository;
    private readonly permissionRepository;
    private readonly rolePermissionRepository;
    private readonly userRoleRepository;
    private readonly cacheInvalidationService;
    constructor(roleRepository: Repository<Role>, permissionRepository: Repository<Permission>, rolePermissionRepository: Repository<RolePermission>, userRoleRepository: Repository<UserRole>, cacheInvalidationService: CacheInvalidationService);
    findAll(query: PaginationQueryDto): Promise<{
        items: Role[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    create(dto: CreateRoleDto): Promise<Role>;
    findOne(id: string): Promise<Role>;
    update(id: string, dto: UpdateRoleDto): Promise<Role>;
    remove(id: string): Promise<void>;
    assignPermissions(id: string, dto: AssignRolePermissionsDto): Promise<Role>;
    removePermission(id: string, permissionId: string): Promise<void>;
    private findRoleById;
    private ensureRoleNameIsAvailable;
}
