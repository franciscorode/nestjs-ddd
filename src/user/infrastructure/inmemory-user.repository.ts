import { ConflictException } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  async create(user: User): Promise<User> {
    const existUser = this.users.some((u) => u.uuid === user.uuid);
    if (existUser) {
      throw new ConflictException('A user with the same UUID already exists.');
    }
    this.users.push(user);
    return user;
  }
  async retrieveAll(): Promise<Array<User>> {
    return this.users;
  }
}
