import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserModel } from 'src/user/infrastructure/user.model';
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [UserModel],
  migrations: ['src/shared/infrastructure/migrations/*.ts'],
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export default AppDataSource;
