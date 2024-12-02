import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { UserModule } from '@src/user/user.module';
import { UserMother } from '../mothers/user.mother';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTestTypeOrmConfig } from '../../config/typeorm-test.config';
import { DataSource } from 'typeorm';
import { UserModel } from '@src/user/infrastructure/user.model';
import { UserRepository } from '@src/user/domain/user.repository';
import { InMemoryUserRepository } from '@src/user/infrastructure/inmemory-user.repository';
import { SqlUserRepository } from '@src/user/infrastructure/sql-user.repository';

describe('User repository', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(getTestTypeOrmConfig()), UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });
  afterEach(async () => {
    await dataSource.getRepository(UserModel).clear();
  });
  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  function getRepoInstance(
    repoClass: typeof InMemoryUserRepository | typeof SqlUserRepository,
  ): UserRepository {
    if (repoClass === SqlUserRepository) {
      return new SqlUserRepository(dataSource.getRepository(UserModel));
    } else if (repoClass === InMemoryUserRepository) {
      return new InMemoryUserRepository();
    }
    throw new Error('Unsupported repository type');
  }

  // Create
  test.each([InMemoryUserRepository, SqlUserRepository])(
    'User repository should create an user successfully',
    async (repoClass) => {
      const repo = getRepoInstance(repoClass);

      const user = UserMother.any();
      expect(await repo.create(user)).toBe(user);
    },
  );
  test.each([InMemoryUserRepository, SqlUserRepository])(
    'User repository should raise conflict error when trying to create an user that already exists',
    async (repoClass) => {
      const repo = getRepoInstance(repoClass);

      const user = UserMother.any();
      await repo.create(user);
      await expect(repo.create(user)).rejects.toThrow(ConflictException);
    },
  );

  // Retrieve all
  test.each([InMemoryUserRepository, SqlUserRepository])(
    'User repository should read all users successfully',
    async (repoClass) => {
      const repo = getRepoInstance(repoClass);

      const user = UserMother.any();
      await repo.create(user);
      const users = await repo.retrieveAll();

      expect(users).toEqual([user]);
    },
  );
});
