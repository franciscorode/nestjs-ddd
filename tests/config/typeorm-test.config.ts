import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModel } from '@src/user/infrastructure/user.model';
import { createDatabase } from 'typeorm-extension';

const HOST = process.env.TEST_DB_HOST || '127.0.0.1';
const PORT = parseInt(process.env.TEST_DB_PORT || '5432', 10);
const USERNAME = process.env.TEST_DB_USERNAME || 'postgres';
const PASSWORD = process.env.TEST_DB_PASSWORD || 'root';
const DATABASE = process.env.TEST_DB_NAME || 'nestjs-ddd-test';

export const getTestTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: [UserModel],
  synchronize: true,
  logging: false,
  verboseRetryLog: false,
});

async function ensureTestDatabaseExists() {
  await createDatabase({
    ifNotExist: true,
    options: {
      type: 'postgres',
      host: HOST,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
      database: DATABASE,
    },
  });
}

ensureTestDatabaseExists().catch((err) => {
  console.error('Error ensuring test database exists:', err);
  process.exit(1);
});
