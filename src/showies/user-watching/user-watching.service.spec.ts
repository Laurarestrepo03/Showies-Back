/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserWatchingService } from './user-watching.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from '../user/user.entity';
import { WatchingEntity } from '../watching/watching.entity';
import { ShowEntity } from '../show/show.entity';


import { faker } from '@faker-js/faker';

describe('UserWatchingService', () => {  let service: UserWatchingService;

  let showRepository: Repository<ShowEntity>;
  let userRepository: Repository<UserEntity>;
  let watchingRepository: Repository<WatchingEntity>;

  let user: UserEntity;
  let showsList: ShowEntity[];
  let watchingList: WatchingEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserWatchingService],
    }).compile();

    service = module.get<UserWatchingService>(UserWatchingService);
    showRepository = module.get<Repository<ShowEntity>>(getRepositoryToken(ShowEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    watchingRepository = module.get<Repository<WatchingEntity>>(getRepositoryToken(WatchingEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    watchingRepository.clear();
    showRepository.clear();
    userRepository.clear();

    user = await userRepository.save({
      id: faker.lorem.sentence(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
      watching: [],
    });

    showsList = [];
    for(let i = 0; i < 5; i++){
      const newShow: ShowEntity = await showRepository.save({
        id: faker.datatype.uuid(),
        name: faker.random.word(),
        poster: faker.image.imageUrl(),
        watching: watchingList
    });
      showsList.push(newShow);
   }

    watchingList = [];
    for(let i = 0; i < 5; i++){
        const watching: WatchingEntity = await watchingRepository.save({
          userId: user.id,
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

  it('findWatchingsByUserId should return watching by user', async ()=>{
    const watching: WatchingEntity[] = await service.findWatchingsByUserId(user.id);
    expect(watching.length).toBe(5)
  });

  it('findWatchingsByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findWatchingsByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

});
