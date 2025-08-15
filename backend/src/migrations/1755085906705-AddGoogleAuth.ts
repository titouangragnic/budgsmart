import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleAuth1755085906705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add Google authentication fields to users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "googleId" character varying,
            ADD COLUMN "picture" character varying
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
