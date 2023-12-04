/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowEntity } from './show.entity';
import { ShowService } from './show.service';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ShowService', () => {
  let service: ShowService;
  let repository: Repository<ShowEntity>;
  let showsList: ShowEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ShowService],
    }).compile();
  
    service = module.get<ShowService>(ShowService);
    repository = module.get<Repository<ShowEntity>>(
      getRepositoryToken(ShowEntity),
    );
    await seedDatabase();  // Make sure this is awaited
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const seedDatabase = async () => {
    repository.clear();
    showsList = [];
    for (let i = 0; i < 5; i++) {
      const show: ShowEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.random.word(),
        poster: faker.image.imageUrl(),
        watching: [],
        genres: [],
      });
      showsList.push(show);
    }
  };

  it('findAll should return all shows', async () => {
    const shows: ShowEntity[] = await service.findAll();
    expect(shows).not.toBeNull();
    expect(shows).toHaveLength(showsList.length);
  });

  it('findOne should return a show by id', async () => {
    const storedShow: ShowEntity = showsList[0];
    const show: ShowEntity = await service.findOne(storedShow.id);
    expect(show).not.toBeNull();
    expect(show.name).toEqual(storedShow.name);
    expect(show.poster).toEqual(storedShow.poster);
  });
  
  it('findOne should throw an exception for an invalid show', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The show with the given id was not found',
    );
  });

  it('create should return a new show', async () => {
    const show: ShowEntity = {
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      poster: faker.image.imageUrl(),
      watching: [],
      genres: [],
    };
    const newShow: ShowEntity = await service.create(show);
    expect(newShow).not.toBeNull();
    const storedShow: ShowEntity = await repository.findOne({
      where: { id: newShow.id },
    });
    expect(storedShow).not.toBeNull();
    expect(storedShow.name).toEqual(storedShow.name);
    expect(storedShow.poster).toEqual(storedShow.poster);
  });

  it('update should modify a show', async () => {
    const show: ShowEntity = showsList[0];
    show.name = 'New name';
    show.name = 'New poster';
    const updatedShow: ShowEntity = await service.update(show.id, show);
    expect(updatedShow).not.toBeNull();
    const storedShow: ShowEntity = await repository.findOne({
      where: { id: show.id },
    });
    expect(storedShow).not.toBeNull();
    expect(storedShow.name).toEqual(show.name);
    expect(storedShow.poster).toEqual(show.poster);
  });

  it('update should throw an exception for an invalid show', async () => {
    let show: ShowEntity = showsList[0];
    show = {
      ...show,
      name: 'New name',
      poster: 'New poster'
    };
    await expect(() => service.update("0", show)).rejects.toHaveProperty("message", "The show with the given id was not found")
  });

  it('delete should remove a show', async () => {
    const show: ShowEntity = showsList[0];
    await service.delete(show.id);
    const deletedShow: ShowEntity = await repository.findOne({ where: { id: show.id } })
    expect(deletedShow).toBeNull();
  });

  it('delete should throw an exception for an invalid show', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The show with the given id was not found")
  });
});
