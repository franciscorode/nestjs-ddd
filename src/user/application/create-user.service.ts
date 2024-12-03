import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { DomainEventBus } from '../shared/domain/domain-event.bus';
import { UserCreated } from '../domain/user-created.event';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('DomainEventBus') private readonly domainEventBus: DomainEventBus,
  ) {}
  async execute(user: User): Promise<User> {
    await this.userRepository.create(user);
    await this.domainEventBus.publish(
      new UserCreated({ name: user.name, uuid: user.uuid }),
    );
    return user;
  }
}
