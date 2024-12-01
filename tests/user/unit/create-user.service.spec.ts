import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from '@src/user/application/create-user.service';
import { UserRepository } from '@src/user/domain/user.repository';
import { UserMother } from '../mothers/user.mother';

describe('test CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn().mockResolvedValue(UserMother.any()),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();
    createUserService = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get<UserRepository>('UserRepository');
  });

  it('should call userRepository.create() with the correct user data', async () => {
    const user = UserMother.any();

    await createUserService.execute(user);

    expect(userRepository.create).toHaveBeenCalledWith(user);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return the created user from userRepository.create()', async () => {
    const user = UserMother.any();

    const result = await createUserService.execute(user);

    expect(result).toEqual(user);
  });
});
