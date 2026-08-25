import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';

/**
 * permissions — eng kichik ruxsat birligi (masalan "loans.approve").
 * `module` ustuni admin panelda filtrlash va guruhlash uchun.
 */
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nuqta-notatsiyali unique identifikator (masalan "loans.approve").
   * Guard va servislar shu qiymat bo'yicha tekshiradi.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /** Foydalanuvchiga ko'rinadigan tavsif/nom. */
  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  /**
   * Modul nomi (masalan "loans", "users") — ro'yxat va filtrlash uchun.
   * Indeks orqali tez `WHERE module = ?` so'rovlarini qo'llab-quvvatlaydi.
   */
  @Index()
  @Column({ type: 'varchar', length: 100 })
  module: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.permission)
  userPermissions: UserPermission[];
}
