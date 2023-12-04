/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';

import { faker } from '@faker-js/faker';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        id: faker.lorem.sentence(),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.lorem.word(),
        watching: [],
      });
      usersList.push(user);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(usersList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(
      storedUser.id,
    );
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name);
    expect(user.email).toEqual(storedUser.email);
    expect(user.password).toEqual(storedUser.password);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: faker.lorem.sentence(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
      watching: [],
    };

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { id: newUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(newUser.name);
    expect(storedUser.email).toEqual(newUser.email);
    expect(storedUser.password).toEqual(newUser.password);
  });

  it('update should modify a user', async () => {
    const user: UserEntity = usersList[0];
    user.name = 'New name';
    user.email = 'new@email.com';
    user.password = 'NEW';

    const updatedUser: UserEntity = await service.update(
      user.id,
      user,
    );
    expect(updatedUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(storedUser).not.toBeNull();
    expect(user.name).toEqual(storedUser.name);
    expect(user.email).toEqual(storedUser.email);
    expect(user.password).toEqual(storedUser.password);
  });

  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = usersList[0];
    user = {
      ...user,
      name: 'New name',
      email: 'new@email.com',
      password: 'NEW',
    };
    await expect(() => service.update('0', user)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should remove a user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);

    const deletedUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });
});