import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { User } from '../domain/user.entity';

export class UserDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @IsUUID()
  uuid: string;

  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  name: string;

  toDomain(): User {
    return new User({ name: this.name, uuid: this.uuid });
  }
}
