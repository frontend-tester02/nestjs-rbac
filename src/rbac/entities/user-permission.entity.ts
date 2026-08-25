import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Permission } from './permission.entity';

/**
 * user_permissions — foydalanuvchi darajasidagi permission override jadvali.
 * Hozircha faqat schema; is_denied orqali individual grant/deny keyinroq qo'llaniladi.
 */
@Entity('user_permissions')
@Unique(['user', 'permission'])
export class UserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @ManyToOne(() => Permission, (permission) => permission.userPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  /**
   * true = roldan kelgan ruxsatni bekor qilish (deny).
   * false = roldan tashqari qo'shimcha ruxsat berish (grant override).
   */
  @Column({ type: 'boolean', default: false })
  isDenied: boolean;
}
