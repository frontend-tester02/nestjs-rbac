"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAuthFieldsToUsers1763980000000 = void 0;
class AddAuthFieldsToUsers1763980000000 {
    constructor() {
        this.name = 'AddAuthFieldsToUsers1763980000000';
    }
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "users" ADD "email" character varying(255)');
        await queryRunner.query('ALTER TABLE "users" ADD "full_name" character varying(255)');
        await queryRunner.query('ALTER TABLE "users" ADD "password_hash" character varying(255)');
        await queryRunner.query('ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_users_email_unique" ON "users" ("email") WHERE email IS NOT NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX "IDX_users_email_unique"');
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "is_active"');
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "password_hash"');
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "full_name"');
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "email"');
    }
}
exports.AddAuthFieldsToUsers1763980000000 = AddAuthFieldsToUsers1763980000000;
//# sourceMappingURL=1763980000000-AddAuthFieldsToUsers.js.map