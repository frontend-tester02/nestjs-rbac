import { User } from '../../users/entities/user.entity';
import { Permission } from './permission.entity';
export declare class UserPermission {
    id: string;
    user: User;
    permission: Permission;
    isDenied: boolean;
}
