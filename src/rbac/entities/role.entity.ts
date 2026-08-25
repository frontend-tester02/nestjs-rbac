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
import { UserRole } from './user-role.entity';

/**
 * roles — tizimdagi rollar (masalan admin, loan_officer).
 * Kodda `@RequireRoles('admin')` kabi machine-readable `name` ishlatiladi.
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Machine-readable identifikator (masalan "admin").
   * Guard va kodda barqaror reference sifatida ishlatiladi.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** UI va admin panelda ko'rsatiladigan inson o'qiydigan nom. */
  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  /**
   * Super-admin barcha permission tekshiruvlarini bypass qiladi.
   * Kam sonli tizim rollari uchun alohida flag — har bir permission qo'shish shart emas.
   */
  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
