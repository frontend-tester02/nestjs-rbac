import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogs1763890000000 implements MigrationInterface {
  name = 'CreateAuditLogs1763890000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "actor_id" uuid NOT NULL,
        "action" character varying(100) NOT NULL,
        "target_user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_actor_id" ON "audit_logs" ("actor_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_target_user_id" ON "audit_logs" ("target_user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_role_id" ON "audit_logs" ("role_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_audit_logs_role_id"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_target_user_id"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_actor_id"');
    await queryRunner.query('DROP TABLE "audit_logs"');
  }
}
