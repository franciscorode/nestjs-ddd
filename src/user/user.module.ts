import { Module } from '@nestjs/common';
import { CreateUserService } from './application/create-user.service';
import { UsersController } from './infrastructure/user.controller';
import { InMemoryUserRepository } from './infrastructure/inmemory-user.repository';
import { GetUsersService } from './application/get-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqlUserRepository } from './infrastructure/sql-user.repository';
import { DataSource } from 'typeorm';
import { InMemoryDomainEventBus } from './shared/infrastructure/inmemory-domain-event.bus';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), ConfigModule],
  providers: [
    CreateUserService,
    GetUsersService,
    {
      provide: 'UserRepository',
      useFactory: (configService: ConfigService, dataSource: DataSource) => {
        const useMockRepo = configService.get<boolean>(
          'USE_MOCK_REPOSITORIES',
          false,
        );
        if (useMockRepo) {
          return new InMemoryUserRepository();
        }
        return new SqlUserRepository(dataSource.getRepository(UserModel));
      },
      inject: [ConfigService, DataSource],
    },
    {
      provide: 'DomainEventBus',
      useFactory: () => {
        return new InMemoryDomainEventBus();
      },
    },
  ],
  controllers: [UsersController],
  exports: [],
})
export class UserModule {}
