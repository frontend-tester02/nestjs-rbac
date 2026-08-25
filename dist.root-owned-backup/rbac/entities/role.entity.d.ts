import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';
export declare class Role {
    id: string;
    name: string;
    displayName: string;
    isSuperAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    rolePermissions: RolePermission[];
    userRoles: UserRole[];
}
