import { User } from '@src/user/domain/user.entity';

export class UserMother {
  static any(): User {
    return new User({
      name: 'user',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
    });
  }
}
