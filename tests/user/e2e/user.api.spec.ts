import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '@src/user/user.module';
import { User } from '@src/user/domain/user.entity';
import { UserMother } from '../mothers/user.mother';

describe('User router (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('GET users return 200 and a list of users', () => {
    return request(app.getHttpServer())
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

  it('Post user create an user successfully and returns it', () => {
    const user = UserMother.any();
    return request(app.getHttpServer())
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
});
