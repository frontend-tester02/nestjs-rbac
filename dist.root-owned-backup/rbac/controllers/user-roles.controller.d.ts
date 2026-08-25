import { AssignUserRolesDto, UpsertUserPermissionOverrideDto } from '../dto';
import { AccessCheckService } from '../services/access-check.service';
import { UserRolesService } from '../services/user-roles.service';
export declare class UserRolesController {
    private readonly userRolesService;
    private readonly accessCheckService;
    constructor(userRolesService: UserRolesService, accessCheckService: AccessCheckService);
    findUserRoles(userId: string): Promise<import("../entities/role.entity").Role[]>;
    assignRoles(userId: string, dto: AssignUserRolesDto, currentUserId?: string): Promise<import("../entities/role.entity").Role[]>;
    removeRole(userId: string, roleId: string, currentUserId?: string): Promise<void>;
    upsertPermissionOverride(userId: string, dto: UpsertUserPermissionOverrideDto): Promise<import("../entities/user-permission.entity").UserPermission>;
    findEffectivePermissions(userId: string, currentUserId?: string): Promise<import("../entities/permission.entity").Permission[]>;
    private ensureCanViewAccess;
}
