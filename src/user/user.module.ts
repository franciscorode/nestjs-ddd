import { Module } from '@nestjs/common';
import { CreateUserService } from './application/create-user.service';
import { UsersController } from './infrastructure/user.controller';
import { GetUsersService } from './application/get-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/user.model';
import { ConfigModule } from '@nestjs/config';
import { AppContainer, SharedModule } from '@src/app.container';
@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), ConfigModule, SharedModule],
  providers: [
    CreateUserService,
    GetUsersService,
    {
      provide: 'UserRepository',
      useFactory: (appContainer: AppContainer) => {
        return appContainer.get('UserRepository');
      },
      inject: [AppContainer],
    },
    {
      provide: 'DomainEventBus',
      useFactory: (appContainer: AppContainer) => {
        return appContainer.get('DomainEventBus');
      },
      inject: [AppContainer],
    },
  ],
  controllers: [UsersController],
  exports: [],
})
export class UserModule {}
