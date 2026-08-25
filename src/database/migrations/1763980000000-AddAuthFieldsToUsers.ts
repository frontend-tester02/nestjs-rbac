import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthFieldsToUsers1763980000000 implements MigrationInterface {
  name = 'AddAuthFieldsToUsers1763980000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD "email" character varying(255)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "full_name" character varying(255)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "password_hash" character varying(255)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_users_email_unique" ON "users" ("email") WHERE email IS NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_users_email_unique"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "is_active"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "password_hash"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "full_name"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "email"');
  }
}
