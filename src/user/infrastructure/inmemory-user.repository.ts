import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
  async retrieveAll(): Promise<Array<User>> {
    return [
      new User({
        name: 'John Doe',
        uuid: '123e4567-e89b-12d3-a456-426614174000',
      }),
    ];
  }
}
