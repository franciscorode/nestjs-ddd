import { Inject, Injectable } from '@nestjs/common';

import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class GetUsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}
  async execute(): Promise<Array<User>> {
    return await this.userRepository.retrieveAll();
  }
}
