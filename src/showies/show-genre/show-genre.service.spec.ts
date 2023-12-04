/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { GenreEntity } from '../genre/genre.entity';
import { Repository } from 'typeorm';
import { ShowEntity } from '../show/show.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { ShowGenreService } from './show-genre.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ShowGenreService', () => {
  let service: ShowGenreService;
  let genreRepository: Repository<GenreEntity>;
  let showRepository: Repository<ShowEntity>;
  let genre: GenreEntity;
  let showsList : ShowEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ShowGenreService],
    }).compile();

    service = module.get<ShowGenreService>(ShowGenreService);
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    showRepository = module.get<Repository<ShowEntity>>(getRepositoryToken(ShowEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    showRepository.clear();
    genreRepository.clear();

    showsList = [];
    for(let i = 0; i < 5; i++){
        const show: ShowEntity = await showRepository.save({
          name: faker.lorem.word(), 
          poster: faker.image.imageUrl(), 
          watching:[],
          genres: [],
        })
        showsList.push(show);
    }

    genre = await genreRepository.save({
      nameEN: faker.lorem.word(), 
      nameES: faker.lorem.word(), 
      nameFR: faker.lorem.word(),
      shows: showsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addShowToGenre should add a show to a genre', async () => {
    const newShow = await showRepository.save({
      id: faker.datatype.uuid(),
      name: faker.lorem.word(), 
      poster: faker.image.imageUrl(), 
      watching:[],
      genres: [],
    });

    const newGenre: GenreEntity = await genreRepository.save({
      id: faker.datatype.uuid(),
      nameEN: faker.lorem.word(), 
      nameES: faker.lorem.word(),
      nameFR: faker.lorem.word(),
      shows: []
    })

    const result: GenreEntity = await service.addShowToGenre(newGenre.id, newShow.id);

    const storedShow: ShowEntity = await showRepository.findOne({where: {id: newShow.id}, relations: ['watching','genres']});
    //const storedGenre: GenreEntity = await genreRepository.findOne({where: {id: newGenre.id}, relations: ['shows']});
    
    expect(result.shows.length).toBe(1);
    expect(result.shows[0]).not.toBeNull();
    expect(result.shows[0].name).toBe(newShow.name)
    expect(result.shows[0].poster).toBe(newShow.poster)
    expect(storedShow.watching).toEqual(newShow.watching)
    expect(storedShow.genres[0].id).toEqual(newGenre.id)
  });

  it('addShowToGenre should thrown exception for an invalid show', async () => {
    const newGenre: GenreEntity = await genreRepository.save({
      nameEN: faker.lorem.word(), 
      nameES: faker.lorem.word(),
      nameFR: faker.lorem.word(),
      shows: []
    })

    await expect(() => service.addShowToGenre(newGenre.id, "0")).rejects.toHaveProperty("message", "The show with the given id was not found");
  });

  it('addShowToGenre should throw an exception for an invalid genre', async () => {
    const newShow = await showRepository.save({
      name: faker.lorem.word(), 
      poster: faker.image.imageUrl(),
      watching:[],
      genres: [],
    });

    await expect(() => service.addShowToGenre("0", newShow.id)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('findShowByGenreIdShowId should return show by genre', async () => {
    const show = showsList[0];
    const storedShow = await service.findShowByGenreIdShowId(genre.id, show.id)
    const storedShowAfterRefresh: ShowEntity = await showRepository.findOne({where: {id: show.id}, relations: ['watching','genres']});
    expect(storedShow).not.toBeNull();
    expect(storedShow.name).toBe(show.name);
    expect(storedShow.poster).toBe(show.poster);
    expect(storedShowAfterRefresh.watching).toEqual(show.watching);
    expect(storedShowAfterRefresh.genres[0].id).toBe(genre.id);
  });

  it('findShowByGenreIdShowId should throw an exception for an invalid show', async () => {
    await expect(()=> service.findShowByGenreIdShowId(genre.id, "0")).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('findShowByGenreIdShowId should throw an exception for an invalid genre', async () => {
    const show = showsList[0]; 
    await expect(()=> service.findShowByGenreIdShowId("0", show.id)).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });

  it('findShowByGenreIdShowId should throw an exception for an show not associated to the genre', async () => {
    const newShow = await showRepository.save({
      name: faker.lorem.word(), 
      poster: faker.image.imageUrl(),
      watching:[],
      genres: [],
    });

    await expect(()=> service.findShowByGenreIdShowId(genre.id, newShow.id)).rejects.toHaveProperty("message", "The show with the given id is not associated to the genre"); 
  });

  it('findShowsByGenreId should return shows by genre', async ()=>{
    const shows = await service.findShowsByGenreId(genre.id);
    expect(shows.length).toBe(5)
  });

  it('findShowsByGenreId should throw an exception for an invalid genre', async () => {
    await expect(()=> service.findShowsByGenreId("0")).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });

  it('associateShowsGenre should update shows list for a genre', async () => {
    const newShow = await showRepository.save({
      name: faker.lorem.word(), 
      poster: faker.image.imageUrl(), 
      watching:[],
      genres: [],
    });

    const updatedGenre: GenreEntity = await service.associateShowsGenre(genre.id, [newShow]);
    expect(updatedGenre.shows.length).toBe(1);

    expect(updatedGenre.shows[0].name).toBe(newShow.name);
    expect(updatedGenre.shows[0].poster).toBe(newShow.poster);
    expect(updatedGenre.shows[0].watching).toBe(newShow.watching);
    expect(updatedGenre.shows[0].genres).toBe(newShow.genres);
  });

  it('associateShowsGenre should throw an exception for an invalid genre', async () => {
    const newShow = await showRepository.save({
      name: faker.lorem.word(), 
      poster: faker.image.imageUrl(), 
      watching:[],
      genres: [],
    });

    await expect(()=> service.associateShowsGenre("0", [newShow])).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });

  it('associateShowsGenre should throw an exception for an invalid show', async () => {
    const newShow = showsList[0];
    newShow.id = "0";

    await expect(()=> service.associateShowsGenre(genre.id, [newShow])).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('deleteShowGenre should remove an show from a genre', async () => {
    const show = showsList[0];
    
    await service.deleteShowGenre(genre.id, show.id);

    const storedGenre: GenreEntity = await genreRepository.findOne({where: {id: genre.id}, relations: ["shows"]});
    const deletedShow = storedGenre.shows.find(a => a.id === show.id);

    expect(deletedShow).toBeUndefined();

  });

  it('deleteShowGenre should thrown an exception for an invalid show', async () => {
    await expect(()=> service.deleteShowGenre(genre.id, "0")).rejects.toHaveProperty("message", "The show with the given id was not found"); 
  });

  it('deleteShowGenre should thrown an exception for an invalid genre', async () => {
    const show = showsList[0];
    await expect(()=> service.deleteShowGenre("0", show.id)).rejects.toHaveProperty("message", "The genre with the given id was not found"); 
  });

  it('deleteShowGenre should thrown an exception for an non asocciated show', async () => {
    const newShow = await showRepository.save({
      name: faker.lorem.word(), 
      poster: faker.image.imageUrl(), 
      watching:[],
      genres: [],
    });

    await expect(()=> service.deleteShowGenre(genre.id, newShow.id)).rejects.toHaveProperty("message", "The show with the given id is not associated to the genre"); 
  }); 

});