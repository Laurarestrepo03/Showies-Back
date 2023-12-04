/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreEntity } from './genre.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { GenreService } from './genre.service';

import { faker } from '@faker-js/faker';

describe('GenreService', () => {
  let service: GenreService;
  let repository: Repository<GenreEntity>;
  let genreList: GenreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GenreService],
    }).compile();

    service = module.get<GenreService>(GenreService);
    repository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    genreList = [];
    for (let i = 0; i < 5; i++) {
      const genre: GenreEntity = await repository.save({
        nameEN: faker.lorem.word(),
        nameES: faker.lorem.word(),
        nameFR: faker.lorem.word(),
        shows: [],
      });
  
      genreList.push(genre);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all genres', async () => {
    const genres: GenreEntity[] = await service.findAll();
    expect(genres).not.toBeNull();
    expect(genres).toHaveLength(genreList.length);
  });

  it('findOne should return a genre by id', async () => {
    const storedGenre: GenreEntity = genreList[0];
    const genre: GenreEntity = await service.findOne(storedGenre.id);
    expect(genre).not.toBeNull();
    expect(genre.nameEN).toEqual(storedGenre.nameEN)
    expect(genre.nameES).toEqual(storedGenre.nameES)
    expect(genre.nameFR).toEqual(storedGenre.nameFR)
    expect(genre.shows).toEqual(storedGenre.shows)
  });

  it('findOne should throw an exception for an invalid genre', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The genre with the given id was not found")
  });

  it('create should return a new genre', async () => {
    const genre: GenreEntity = {
      id: faker.datatype.uuid(),
      nameEN: faker.lorem.word(), 
      nameES: faker.lorem.word(),
      nameFR: faker.lorem.word(),
      shows: [],
    }

    const newGenre: GenreEntity = await service.create(genre);
    expect(newGenre).not.toBeNull();

    const storedGenre: GenreEntity = await repository.findOne({where: {id: newGenre.id}, relations: ['shows']})
    expect(storedGenre).not.toBeNull();
    expect(storedGenre.nameEN).toEqual(newGenre.nameEN)
    expect(storedGenre.nameES).toEqual(newGenre.nameES)
    expect(storedGenre.nameFR).toEqual(newGenre.nameFR)
    expect(storedGenre.shows).toEqual(newGenre.shows)
  });

  it('update should modify a genre', async () => {
    const genre: GenreEntity = genreList[0];
    genre.nameEN = "New name";
    genre.nameFR = "Nouveau nom";
  
    const updatedGenre: GenreEntity = await service.update(genre.id, genre);
    expect(updatedGenre).not.toBeNull();
  
    const storedGenre: GenreEntity = await repository.findOne({ where: { id: genre.id } })
    expect(storedGenre).not.toBeNull();
    expect(storedGenre.nameEN).toEqual(genre.nameEN)
    expect(storedGenre.nameFR).toEqual(genre.nameFR)
  });
 
  it('update should throw an exception for an invalid genre', async () => {
    let genre: GenreEntity = genreList[0];
    genre = {
      ...genre, nameEN: "New name", nameFR: "Nouveau nom"
    }
    await expect(() => service.update("0", genre)).rejects.toHaveProperty("message", "The genre with the given id was not found")
  });

  it('delete should remove a genre', async () => {
    const genre: GenreEntity = genreList[0];
    await service.delete(genre.id);
  
    const deletedGenre: GenreEntity = await repository.findOne({ where: { id: genre.id } })
    expect(deletedGenre).toBeNull();
  });

  it('delete should throw an exception for an invalid genre', async () => {
    const genre: GenreEntity = genreList[0];
    await service.delete(genre.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The genre with the given id was not found")
  });
 
});