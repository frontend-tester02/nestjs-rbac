import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';
export declare class UserRole {
    id: string;
    user: User;
    role: Role;
    assignedByUser: User | null;
    assignedAt: Date;
}
