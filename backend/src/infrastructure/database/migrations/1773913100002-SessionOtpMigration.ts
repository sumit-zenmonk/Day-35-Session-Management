import { MigrationInterface, QueryRunner, Table, TableForeignKey, } from "typeorm";

export class SessionsOtpMigration1773913100002 implements MigrationInterface {
    name = "SessionsOtpMigration1773913100002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "sessions_otp",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", },
                    { name: "email", type: "varchar", },
                    { name: "otp", type: "int", },
                    { name: "expiresAt", type: "timestamp", },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("sessions", true);
    }
}