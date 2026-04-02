import { MigrationInterface, QueryRunner, Table, TableForeignKey, } from "typeorm";

export class SessionsMigration1773913100001 implements MigrationInterface {
    name = "SessionsMigration1773913100001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "sessions",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", },
                    { name: "deviceId", type: "varchar", },
                    { name: "deviceType", type: "varchar", isNullable: true, },
                    { name: "ip", type: "varchar", isNullable: true, },
                    { name: "userAgent", type: "varchar", isNullable: true, },
                    { name: "userUuid", type: "uuid", isNullable: true, },
                    { name: "expiresAt", type: "timestamp", },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "sessions",
            new TableForeignKey({
                name: "FK_sessions_user",
                columnNames: ["userUuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("sessions", "FK_sessions_user");
        await queryRunner.dropTable("sessions", true);
    }
}