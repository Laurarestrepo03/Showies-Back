/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ShowWatchingService } from './show-watching.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { ShowEntity } from '../show/show.entity';
import { UserEntity } from '../user/user.entity';
import { WatchingEntity } from '../watching/watching.entity';

import { faker } from '@faker-js/faker';

describe('ShowWatchingService', () => {
  let service: ShowWatchingService;

  let showRepository: Repository<ShowEntity>;
  let userRepository: Repository<UserEntity>;
  let watchingRepository: Repository<WatchingEntity>;

  let show: ShowEntity;
  let usersList: UserEntity[];
  let watchingList: WatchingEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ShowWatchingService],
    }).compile();

    service = module.get<ShowWatchingService>(ShowWatchingService);
    showRepository = module.get<Repository<ShowEntity>>(getRepositoryToken(ShowEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    watchingRepository = module.get<Repository<WatchingEntity>>(getRepositoryToken(WatchingEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    watchingRepository.clear();
    showRepository.clear();
    userRepository.clear();

    show = await showRepository.save({
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      poster: faker.image.imageUrl(),
      watching: watchingList
    });

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

    watchingList = [];
    for(let i = 0; i < 5; i++){
        const watching: WatchingEntity = await watchingRepository.save({
          userId: usersList[i].id,
          showId: show.id,
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

  it('findWatchingsByShowId should return watching by show', async ()=>{
    const watching: WatchingEntity[] = await service.findWatchingsByShowId(show.id);
    expect(watching.length).toBe(5)
  });

  it('findWatchingsByShowId should throw an exception for an invalid show', async () => {
    await expect(()=> service.findWatchingsByShowId("0")).rejects.toHaveProperty("message", "The show with the given id was not found");
  });

});
