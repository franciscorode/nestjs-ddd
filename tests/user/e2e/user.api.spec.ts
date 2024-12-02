import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '@src/user/user.module';
import { User } from '@src/user/domain/user.entity';
import { UserMother } from '../mothers/user.mother';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTestTypeOrmConfig } from './typeorm-test.config';
import { DataSource } from 'typeorm';
import { UserModel } from '@src/user/infrastructure/user.model';

describe('User router (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
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
  it('GET users return 200 and a list of users', async () => {
    return await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((user: User) => {
          expect(user).toMatchObject({
            name: expect.any(String),
            uuid: expect.any(String),
          });
        });
      });
  });

  it('Post user create an user successfully and returns it', async () => {
    const user = UserMother.any();
    return await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          name: user.name,
          uuid: user.uuid,
        });
      });
  });

  it('Post user should return 409 when exist a user with same uuid', async () => {
    const user = UserMother.any();
    await request(app.getHttpServer()).post('/users').send(user);
    return await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(409);
  });
});
