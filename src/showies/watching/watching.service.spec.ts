/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { ShowEntity } from '../show/show.entity';
import { UserEntity } from '../user/user.entity';
import { WatchingEntity } from './watching.entity';
import { WatchingService } from '../../showies/watching/watching.service';

import { faker } from '@faker-js/faker';

describe('WatchingService', () => {
  let service: WatchingService;

  let repository: Repository<WatchingEntity>;
  let userRepository: Repository<UserEntity>;
  let showRepository: Repository<ShowEntity>;

  let watchingList: WatchingEntity[];
  let usersList: UserEntity[];
  let showsList: ShowEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [WatchingService],
    }).compile();

    service = module.get<WatchingService>(WatchingService);
    repository = module.get<Repository<WatchingEntity>>(getRepositoryToken(WatchingEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    showRepository = module.get<Repository<ShowEntity>>(getRepositoryToken(ShowEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    userRepository.clear();
    showRepository.clear();

    usersList = [];
    for(let i = 0; i < 5; i++){
      const user: UserEntity = await userRepository.save({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    })
      usersList.push(user);
   }

   showsList = [];
   for(let i = 0; i < 5; i++){
    const show: ShowEntity = await showRepository.save({
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      poster: faker.image.imageUrl(),
    })
      showsList.push(show);
    }

    watchingList = [];
    for(let i = 0; i < 5; i++){
        const watching: WatchingEntity = await repository.save({
          userId: usersList[i].id,
          showId: showsList[i].id,
          season: faker.datatype.number(),
          episode: faker.datatype.number(),
          lastSeen: faker.datatype.number({min: 1928, max: 2023}) + "-0" + faker.datatype.number({min: 1, max: 9}) + "-0" + faker.datatype.number({min: 1, max: 9})
      })
        watchingList.push(watching);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all watchings', async () => {
    const watchings: WatchingEntity[] = await service.findAll();
    expect(watchings).not.toBeNull();
    expect(watchings).toHaveLength(watchingList.length);
  });

  it('findOne should return a watching by user id and show id', async () => {
    const storedWatching: WatchingEntity = watchingList[0];
    const watching: WatchingEntity = await service.findOne(storedWatching.userId, storedWatching.showId);
    expect(watching).not.toBeNull();
    expect(watching.season).toEqual(storedWatching.season)
    expect(watching.episode).toEqual(storedWatching.episode)
    expect(watching.lastSeen).toEqual(storedWatching.lastSeen)
  });

  it('findOne should throw an exception for an invalid watching', async () => {
    await expect(() => service.findOne("0", "0")).rejects.toHaveProperty("message", "The watching with the given user and show ids was not found")
  });

  it('create should return a new watching', async () => {
    const watching: WatchingEntity = {
      userId: usersList[0].id,
      showId: showsList[1].id,
      season: faker.datatype.number(),
      episode: faker.datatype.number(),
      lastSeen: faker.datatype.number({min: 1928, max: 2023}) + "-0" + faker.datatype.number({min: 1, max: 9}) + "-0" + faker.datatype.number({min: 1, max: 9}),
      user: usersList[0],
      show: showsList[1]
    }
 
    const newWatching: WatchingEntity = await service.create(watching);
    expect(newWatching).not.toBeNull();
 
    const storedWatching: WatchingEntity = await repository.findOne({where: { userId: watching.userId, showId: watching.showId }})
    expect(storedWatching).not.toBeNull();
    expect(storedWatching.season).toEqual(watching.season)
    expect(storedWatching.episode).toEqual(watching.episode)
    expect(storedWatching.lastSeen).toEqual(watching.lastSeen)
  });

  it('update should modify a watching', async () => {
    const watching: WatchingEntity = watchingList[0];
    watching.season = 2;
    watching.episode = 1;
    const updatedWatching: WatchingEntity = await service.update(watching.userId, watching.showId, watching);
    expect(updatedWatching).not.toBeNull();
    const storedWatching: WatchingEntity = await repository.findOne({ where: { userId: watching.userId, showId: watching.showId } })
    expect(storedWatching).not.toBeNull();
    expect(storedWatching.season).toEqual(watching.season)
    expect(storedWatching.episode).toEqual(watching.episode)
  });

  it('update should throw an exception for an invalid watching', async () => {
    let watching: WatchingEntity = watchingList[0];
    watching = {
      ...watching, season: 2, episode: 1
    }
    await expect(() => service.update("0", "0", watching)).rejects.toHaveProperty("message", "The watching with the given user and show ids was not found")
  });

  it('delete should remove a watching', async () => {
    const watching: WatchingEntity = watchingList[0];
    await service.delete(watching.userId, watching.showId);
    const deletedWatching: WatchingEntity = await repository.findOne({ where: { userId: watching.userId, showId: watching.showId } })
    expect(deletedWatching).toBeNull();
  });

  it('delete should throw an exception for an invalid watching', async () => {
    await expect(()=> service.findOne("0", "0")).rejects.toHaveProperty("message", "The watching with the given user and show ids was not found");
  });

});
