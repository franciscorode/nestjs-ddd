import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InMemoryUserRepository } from './user/infrastructure/inmemory-user.repository';
import { SqlUserRepository } from './user/infrastructure/sql-user.repository';
import { InMemoryDomainEventBus } from './user/shared/infrastructure/inmemory-domain-event.bus';
import { UserModel } from './user/infrastructure/user.model';

@Injectable()
export class AppContainer {
  private dependencies = new Map<string, any>();

  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
    this.initializeDependencies();
  }

  private initializeDependencies() {
    // UserRepository
    const useMockRepo = this.configService.get<boolean>(
      'USE_MOCK_REPOSITORIES',
      false,
    );
    const userRepository = useMockRepo
      ? new InMemoryUserRepository()
      : new SqlUserRepository(this.dataSource.getRepository(UserModel));
    this.dependencies.set('UserRepository', userRepository);

    // DomainEventBus
    this.dependencies.set('DomainEventBus', new InMemoryDomainEventBus());
  }

  get<T>(key: string): T {
    return this.dependencies.get(key);
  }
}

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    {
      provide: AppContainer,
      useFactory: (configService: ConfigService, dataSource: DataSource) => {
        return new AppContainer(configService, dataSource);
      },
      inject: [ConfigService, DataSource],
    },
  ],
  exports: [AppContainer],
})
export class SharedModule {}
