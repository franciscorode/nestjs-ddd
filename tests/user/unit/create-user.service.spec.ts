import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from '@src/user/application/create-user.service';
import { UserRepository } from '@src/user/domain/user.repository';
import { UserMother } from '../mothers/user.mother';
import { DomainEventBus } from '@src/user/shared/domain/domain-event.bus';
import { ConflictException } from '@nestjs/common';

describe('test CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepository: UserRepository;
  let eventBus: DomainEventBus;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn().mockResolvedValue(UserMother.any()),
    };
    const mockEventBus = {
      publish: jest.fn().mockResolvedValue(null),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: 'DomainEventBus', useValue: mockEventBus },
      ],
    }).compile();
    createUserService = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get<UserRepository>('UserRepository');
    eventBus = module.get<DomainEventBus>('DomainEventBus');
  });

  it('should create user successfully', async () => {
    const user = UserMother.any();

    const result = await createUserService.execute(user);

    expect(result).toEqual(user);
    expect(userRepository.create).toHaveBeenCalledWith(user);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
  });

  it('should exit without publish event if fails trying to create user', async () => {
    (userRepository.create as jest.Mock).mockRejectedValue(new Error());

    const user = UserMother.any();

    await expect(createUserService.execute(user)).rejects.toThrow(Error);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledTimes(0);
  });
});
