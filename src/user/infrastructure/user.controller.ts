import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserService } from '../application/create-user.service';
import { GetUsersService } from '../application/get-users.service';
import { User } from '../domain/user.entity';
import { UserDto } from './user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUsersService: GetUsersService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [UserDto], description: 'Retrieve all users' })
  async findAll(): Promise<Array<User>> {
    return await this.getUsersService.execute();
  }
  @Post()
  @ApiCreatedResponse({ type: User, description: 'Create a new user' })
  @ApiConflictResponse({ description: 'Conflict: User already exists.' })
  async create(@Body() userDto: UserDto): Promise<User> {
    return await this.createUserService.execute(userDto.toDomain());
  }
}
