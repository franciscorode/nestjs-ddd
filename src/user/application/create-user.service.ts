import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}
  async execute(user: User): Promise<User> {
    return await this.userRepository.create(user);
  }
}
