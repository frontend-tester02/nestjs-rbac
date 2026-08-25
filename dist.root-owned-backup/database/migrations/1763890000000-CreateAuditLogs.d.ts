import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateAuditLogs1763890000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
