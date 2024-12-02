import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModel } from '@src/user/infrastructure/user.model';

export const getTestTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.TEST_DB_HOST || '127.0.0.1',
  port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
  username: process.env.TEST_DB_USERNAME || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'root',
  database: process.env.TEST_DB_NAME || 'nestjs-ddd',
  entities: [UserModel],
  synchronize: true,
  logging: false,
});
