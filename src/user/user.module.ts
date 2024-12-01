import { Module } from '@nestjs/common';
import { CreateUserService } from './application/create-user.service';
import { UsersController } from './infrastructure/user.controller';
import { InMemoryUserRepository } from './infrastructure/inmemory-user.repository';
import { GetUsersService } from './application/get-users.service';

@Module({
  imports: [],
  providers: [
    CreateUserService,
    GetUsersService,
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [],
})
export class UserModule {}
