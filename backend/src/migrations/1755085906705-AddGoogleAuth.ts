import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleAuth1755085906705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add Google authentication fields to users table if they don't exist
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "googleId" character varying,
            ADD COLUMN IF NOT EXISTS "picture" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove Google authentication fields from users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "googleId",
            DROP COLUMN "picture"
        `);
    }

}
