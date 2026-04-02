import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UsersMigration1773913000000 implements MigrationInterface {
    name = "UsersMigration1773913000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", },
                    { name: "name", type: "varchar", },
                    { name: "email", type: "varchar", isUnique: true, },
                    { name: "password", type: "varchar", },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users", true);
    }
}