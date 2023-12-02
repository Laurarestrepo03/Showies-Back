/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowEntity } from '../show/show.entity';
import { GenreEntity } from '../genre/genre.entity';
import { Repository } from 'typeorm';
import { BusinessError,BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class ShowGenreService {
    constructor(
        @InjectRepository(ShowEntity)
        private readonly showRepository: Repository<ShowEntity>,
    
        @InjectRepository(GenreEntity)
        private readonly genreRepository: Repository<GenreEntity>
    ) {}

    async addShowToGenre(genreId: string, showId: string): Promise<GenreEntity> {
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}});
        if (!show)
          throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND);
      
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}, relations: ["shows"]})
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
    
        genre.shows.push(show);
        return await this.genreRepository.save(genre);
      }
    
    async findShowsByGenreId(genreId: string): Promise<ShowEntity[]> {
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}, relations: ["shows"]});
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
       
        return genre.shows;
    }

    async findShowByGenreIdShowId(genreId: string, showId: string): Promise<ShowEntity> {
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}});
        if (!show)
          throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
       
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}, relations: ["shows"]});
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
   
        const genreShow: ShowEntity = genre.shows.find(e => e.id === show.id);
   
        if (!genreShow)
          throw new BusinessLogicException("The show with the given id is not associated to the genre", BusinessError.PRECONDITION_FAILED)
   
        return genreShow;
    }

    async associateShowsGenre(genreId: string, shows: ShowEntity[]): Promise<GenreEntity> {
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}, relations: ["shows"]});
    
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < shows.length; i++) {
          const show: ShowEntity = await this.showRepository.findOne({where: {id: shows[i].id}});
          if (!show)
            throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        genre.shows = shows;
        return await this.genreRepository.save(genre);
      }
    
    async deleteShowGenre(genreId: string, showId: string){
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}});
        if (!show)
          throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
    
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}, relations: ["shows"]});
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
    
        const genreShow: ShowEntity = genre.shows.find(e => e.id === show.id);
    
        if (!genreShow)
            throw new BusinessLogicException("The show with the given id is not associated to the genre", BusinessError.PRECONDITION_FAILED)
 
        genre.shows = genre.shows.filter(e => e.id !== showId);
        await this.genreRepository.save(genre);
    } 
}