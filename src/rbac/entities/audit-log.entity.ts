import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'actor_id' })
  actorId: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Index()
  @Column({ type: 'uuid', name: 'target_user_id' })
  targetUserId: string;

  @Index()
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'timestamp' })
  timestamp: Date;
}
