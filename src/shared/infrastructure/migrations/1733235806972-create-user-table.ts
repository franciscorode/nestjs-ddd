import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1733235806972 implements MigrationInterface {
  name = 'CreateUserTable1733235806972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_model" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_832c4f33c91b3eb4797220e6f99" UNIQUE ("uuid"), CONSTRAINT "PK_7d6bfa71f4d6a1fa0af1f688327" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_model"`);
  }
}
