import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

/**
 * users — RBAC bog'lanishlari uchun minimal foydalanuvchi jadvali.
 * To'liq auth moduli keyinroq kengaytiriladi; hozir faqat FK va audit uchun kerak.
 */
@Entity('users')
export class User {
	/** UUID — tashqi tizimlar bilan integratsiyada ID conflict bo'lmasligi uchun. */
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Index({ unique: true, where: 'email IS NOT NULL' })
	@Column({ type: 'varchar', length: 255, nullable: true })
	email!: string | null

	@Column({ type: 'varchar', length: 255, name: 'full_name', nullable: true })
	fullName!: string | null

	@Column({ type: 'varchar', length: 255, name: 'password_hash', nullable: true })
	passwordHash!: string | null

	@Column({ type: 'boolean', name: 'is_active', default: true })
	isActive!: boolean

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt!: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt!: Date
}
