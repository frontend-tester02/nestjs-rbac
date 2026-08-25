import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';
export declare class Permission {
    id: string;
    name: string;
    displayName: string;
    module: string;
    createdAt: Date;
    updatedAt: Date;
    rolePermissions: RolePermission[];
    userPermissions: UserPermission[];
}
