import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../domain/user.entity';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column()
  name: string;

  to_domain(): User {
    return new User({ uuid: this.uuid, name: this.name });
  }
  static from_domain(user: User): UserModel {
    const userModel = new UserModel();
    userModel.uuid = user.uuid;
    userModel.name = user.name;
    return userModel;
  }
}
