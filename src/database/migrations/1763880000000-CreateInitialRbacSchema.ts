import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialRbacSchema1763880000000
  implements MigrationInterface
{
  name = 'CreateInitialRbacSchema1763880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "display_name" character varying(255) NOT NULL,
        "is_super_admin" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_roles_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(150) NOT NULL,
        "display_name" character varying(255) NOT NULL,
        "module" character varying(100) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_permissions_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "role_id" uuid,
        "permission_id" uuid,
        CONSTRAINT "PK_role_permissions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_role_permissions_role_permission" UNIQUE ("role_id", "permission_id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "role_id" uuid,
        "assigned_by" uuid,
        "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_roles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_roles_user_role" UNIQUE ("user_id", "role_id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "permission_id" uuid,
        "is_denied" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_user_permissions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_permissions_user_permission" UNIQUE ("user_id", "permission_id")
      )
    `);

    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_roles_name_unique" ON "roles" ("name")',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_permissions_name_unique" ON "permissions" ("name")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_permissions_module" ON "permissions" ("module")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_role_permissions_role_id" ON "role_permissions" ("role_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_role_permissions_permission_id" ON "role_permissions" ("permission_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_user_roles_user_id" ON "user_roles" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_user_roles_role_id" ON "user_roles" ("role_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_user_roles_assigned_by" ON "user_roles" ("assigned_by")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_user_permissions_user_id" ON "user_permissions" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_user_permissions_permission_id" ON "user_permissions" ("permission_id")',
    );

    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_role_permissions_role_id"
      FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_role_permissions_permission_id"
      FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_user_roles_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_user_roles_role_id"
      FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_user_roles_assigned_by"
      FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_user_permissions_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_user_permissions_permission_id"
      FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_user_permissions_permission_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_user_permissions_user_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_assigned_by"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_role_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_user_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_permission_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_role_id"',
    );
    await queryRunner.query('DROP INDEX "IDX_user_permissions_permission_id"');
    await queryRunner.query('DROP INDEX "IDX_user_permissions_user_id"');
    await queryRunner.query('DROP INDEX "IDX_user_roles_assigned_by"');
    await queryRunner.query('DROP INDEX "IDX_user_roles_role_id"');
    await queryRunner.query('DROP INDEX "IDX_user_roles_user_id"');
    await queryRunner.query('DROP INDEX "IDX_role_permissions_permission_id"');
    await queryRunner.query('DROP INDEX "IDX_role_permissions_role_id"');
    await queryRunner.query('DROP INDEX "IDX_permissions_module"');
    await queryRunner.query('DROP INDEX "IDX_permissions_name_unique"');
    await queryRunner.query('DROP INDEX "IDX_roles_name_unique"');
    await queryRunner.query('DROP TABLE "user_permissions"');
    await queryRunner.query('DROP TABLE "user_roles"');
    await queryRunner.query('DROP TABLE "role_permissions"');
    await queryRunner.query('DROP TABLE "permissions"');
    await queryRunner.query('DROP TABLE "roles"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
