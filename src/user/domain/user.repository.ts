import { User } from './user.entity';

export interface UserRepository {
  create(user: User): Promise<User>;
  retrieveAll(): Promise<Array<User>>;
}
