import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersService } from '@src/user/application/get-users.service';
import { UserRepository } from '@src/user/domain/user.repository';
import { UserMother } from '../mothers/user.mother';

describe('test GetUsersService', () => {
  let getUsersService: GetUsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      retrieveAll: jest.fn().mockResolvedValue([UserMother.any()]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();
    getUsersService = module.get<GetUsersService>(GetUsersService);
    userRepository = module.get<UserRepository>('UserRepository');
  });

  it('should call userRepository.retrieveAll()', async () => {
    await getUsersService.execute();

    expect(userRepository.retrieveAll).toHaveBeenCalledTimes(1);
  });

  it('should return existing users', async () => {
    const user = UserMother.any();

    const result = await getUsersService.execute();

    expect(result).toEqual([user]);
  });
});
