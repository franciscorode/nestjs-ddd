import { User } from './user.entity';

export interface UserRepository {
  create(user: User): Promise<User>;
  retrieveAll(): Promise<Array<User>>;
  retrieve_by_name(name: string): Promise<User>;
}
