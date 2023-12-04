/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ShowEntity } from '../show/show.entity';
import { GenreEntity } from '../genre/genre.entity';
import { GenreShowService } from './genre-show.service';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('GenreShowService', () => {
  let service: GenreShowService;
  let genreRepository: Repository<GenreEntity>;
  let showRepository: Repository<ShowEntity>;
  let show: ShowEntity;
  let genresList : GenreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GenreShowService],
    }).compile();

    service = module.get<GenreShowService>(GenreShowService);
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    showRepository = module.get<Repository<ShowEntity>>(getRepositoryToken(ShowEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    showRepository.clear();
    genreRepository.clear();

    genresList = [];
    for(let i = 0; i < 5; i++){
        const genre: GenreEntity = await genreRepository.save({
          nameEN: faker.company.name(), 
          nameES: faker.company.name(), 
          nameFR: faker.company.name(), 
          shows: [],
        })
        genresList.push(genre);
    }

    show = await showRepository.save({
      name: faker.company.name(), 
      poster: faker.company.name(), 
      watching:[],
      genres: genresList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addGenreToShow should add a genre to a show', async () => {
    const newGenre = await genreRepository.save({
      nameEN: faker.company.name(), 
      nameES: faker.company.name(), 
      nameFR: faker.company.name(), 
      shows: [],
    });

    const newShow: ShowEntity = await showRepository.save({
      name: faker.company.name(), 
      poster: faker.company.name(), 
      watching:[],
      genres: [],
    })

    const result: ShowEntity = await service.addGenreToShow(newShow.id, newGenre.id);
    
    expect(result.genres.length).toBe(1);
    expect(result.genres[0]).not.toBeNull();
    expect(result.genres[0].nameEN).toBe(newGenre.nameEN)
    expect(result.genres[0].nameES).toBe(newGenre.nameES)
    expect(result.genres[0].nameFR).toBe(newGenre.nameFR)
    //expect(result.genres[0].shows).toBe(newGenre.shows)
  });

  it('addGenreToShow should thrown exception for an invalid genre', async () => {
    const newShow: ShowEntity = await showRepository.save({
      name: faker.company.name(), 
      poster: faker.company.name(), 
      watching:[],
      genres: []
    })

    await expect(() => service.addGenreToShow(newShow.id, "0")).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('addGenreToShow should throw an exception for an invalid show', async () => {
    const newGenre = await genreRepository.save({
      nameEN: faker.company.name(), 
      nameES: faker.company.name(), 
      nameFR: faker.company.name(), 
      shows: [],
    });

    await expect(() => service.addGenreToShow("0", newGenre.id)).rejects.toHaveProperty("message", "The show with the given id was not found");
  });

  it('findGenreByShowIdGenreId should return genre by show', async () => {
    const genre = genresList[0];
    const storedGenre = await service.findGenreByShowIdGenreId(show.id, genre.id)
    expect(storedGenre).not.toBeNull();
    expect(storedGenre.nameES).toBe(genre.nameES);
    expect(storedGenre.nameEN).toBe(genre.nameEN);
    expect(storedGenre.nameFR).toBe(genre.nameFR);
    //expect(storedGenre.shows).toBe(genre.shows);
  });

  it('findGenreByShowIdGenreId should throw an exception for an invalid genre', async () => {
    await expect(()=> service.findGenreByShowIdGenreId(show.id, "0")).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });

  it('findGenreByShowIdGenreId should throw an exception for an invalid show', async () => {
    const genre = genresList[0]; 
    await expect(()=> service.findGenreByShowIdGenreId("0", genre.id)).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('findGenreByShowIdGenreId should throw an exception for a genre not associated to the show', async () => {
    const newGenre = await genreRepository.save({
      nameEN: faker.company.name(), 
      nameES: faker.company.name(), 
      nameFR: faker.company.name(), 
      shows: [],
    });

    await expect(()=> service.findGenreByShowIdGenreId(show.id, newGenre.id)).rejects.toHaveProperty("message", "The genre with the given id is not associated to the show"); 
  });

  it('findGenresByShowId should return genres by show', async ()=>{
    const genres = await service.findGenresByShowId(show.id);
    expect(genres.length).toBe(5)
  });

  it('findGenresByShowId should throw an exception for an invalid show', async () => {
    await expect(()=> service.findGenresByShowId("0")).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('associateGenresShow should update genres list for a show', async () => {
    const newGenre = await genreRepository.save({
      nameEN: faker.company.name(), 
      nameES: faker.company.name(), 
      nameFR: faker.company.name(), 
      shows: [],
    });

    const updatedShow: ShowEntity = await service.associateGenreShows(show.id, [newGenre]);
    expect(updatedShow.genres.length).toBe(1);
    expect(updatedShow.genres[0].nameEN).toBe(newGenre.nameEN);
    expect(updatedShow.genres[0].nameES).toBe(newGenre.nameES);
    expect(updatedShow.genres[0].nameFR).toBe(newGenre.nameFR);
    expect(updatedShow.genres[0].shows).toBe(newGenre.shows);
  });

  it('associateGenresShow should throw an exception for an invalid show', async () => {
    const newGenre = await genreRepository.save({
      nameEN: faker.company.name(), 
      nameES: faker.company.name(), 
      nameFR: faker.company.name(), 
      shows: [],
    });

    await expect(()=> service.associateGenreShows("0", [newGenre])).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('associateGenresShow should throw an exception for an invalid genre', async () => {
    const newGenre = genresList[0];
    newGenre.id = "0";

    await expect(()=> service.associateGenreShows(show.id, [newGenre])).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });
//
  it('deleteGenreShow should remove an genre from a show', async () => {
    const genre = genresList[0];
    
    await service.deleteGenreShow(show.id, genre.id);

    const storedShow: ShowEntity = await showRepository.findOne({where: {id: show.id}, relations: ["genres"]});
    const deletedGenre = storedShow.genres.find(a => a.id === genre.id);

    expect(deletedGenre).toBeUndefined();

  });

  it('deleteGenreShow should thrown an exception for an invalid genre', async () => {
    await expect(()=> service.deleteGenreShow(show.id, "0")).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });

  it('deleteGenreShow should thrown an exception for an invalid show', async () => {
    const genre = genresList[0];
    await expect(()=> service.deleteGenreShow("0", genre.id)).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('deleteGenreShow should thrown an exception for a non asocciated genre', async () => {
    const newGenre = await genreRepository.save({
      nameEN: faker.company.name(), 
      nameES: faker.company.name(), 
      nameFR: faker.company.name(), 
      shows: [],
    });

    await expect(()=> service.deleteGenreShow(show.id, newGenre.id)).rejects.toHaveProperty("message", "The genre with the given id is not associated to the show"); 
  }); 

});