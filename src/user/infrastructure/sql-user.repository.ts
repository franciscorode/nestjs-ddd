import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { Repository } from 'typeorm';
import { UserModel } from './user.model';

@Injectable()
export class SqlUserRepository implements UserRepository {
  constructor(
    @Inject('UserRepository')
    private userRepository: Repository<UserModel>,
  ) {}

  async create(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { uuid: user.uuid },
    });

    if (existingUser) {
      throw new ConflictException('A user with the same UUID already exists.');
    }
    await this.userRepository.save(UserModel.from_domain(user));
    return user;
  }

  async retrieveAll(): Promise<Array<User>> {
    const userModels = await this.userRepository.find();
    return userModels.map((userModel) => userModel.to_domain());
  }
}
