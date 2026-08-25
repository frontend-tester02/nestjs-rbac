import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';

/**
 * user_roles — User ↔ Role many-to-many join jadvali.
 * assigned_by / assigned_at audit ustunlari: kim va qachon rol biriktirganini kuzatish uchun.
 */
@Entity('user_roles')
@Unique(['user', 'role'])
@Index(['assignedByUser'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  /**
   * Rolni biriktirgan admin foydalanuvchi.
   * Nullable — tizim (seed/migration) orqali biriktirishda bo'sh qoldirilishi mumkin.
   */
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_by' })
  assignedByUser: User | null;

  /** Rol biriktirilgan vaqt — audit va tarixiy hisobotlar uchun. */
  @CreateDateColumn({ type: 'timestamptz' })
  assignedAt: Date;
}
