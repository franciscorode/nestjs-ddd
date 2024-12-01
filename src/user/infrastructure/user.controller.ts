import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { CreateUserService } from '../application/create-user.service';
import { GetUsersService } from '../application/get-users.service';

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
    return this.getUsersService.execute();
  }
  @Post()
  @ApiCreatedResponse({ type: User, description: 'Create a new user' })
  async create(@Body() userDto: UserDto): Promise<User> {
    return this.createUserService.execute(userDto.toDomain());
  }
}
