/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowEntity } from '../show/show.entity';
import { GenreEntity } from '../genre/genre.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class GenreShowService {
    constructor(
        @InjectRepository(GenreEntity)
        private readonly genreRepository: Repository<GenreEntity>,
        @InjectRepository(ShowEntity)
        private readonly showRepository: Repository<ShowEntity>
    ) {}

    async addGenreToShow(showId: string, genreId: string): Promise<ShowEntity> {
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}});
        if (!genre)
            throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);

        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}, relations: ["genres"]})
        if (!show)
            throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND);
    
        show.genres = [...show.genres, genre];
        return await this.showRepository.save(show);
    }
    
    async findGenresByShowId(showId: string): Promise<GenreEntity[]> {
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}, relations: ["genres"]});
        if (!show)
            throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
        return show.genres;
    }
    
    
    async findGenreByShowIdGenreId(showId: string, genreId: string): Promise<GenreEntity> {
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}});
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
       
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}, relations: ["genres"]});
        if (!show)
          throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
   
        const showGenre: GenreEntity = show.genres.find(e => e.id === genre.id);
   
        if (!showGenre)
          throw new BusinessLogicException("The genre with the given id is not associated to the show", BusinessError.PRECONDITION_FAILED)
   
        return showGenre;
    }

    async associateGenreShows(showId: string, genres: GenreEntity[]): Promise<ShowEntity> {
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}, relations: ["genres"]});
    
        if (!show)
            throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < genres.length; i++) {
            const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genres[i].id}});
            if (!genre)
                throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        show.genres = genres;
        return await this.showRepository.save(show);
    }

    async deleteGenreShow(showId: string, genreId: string){
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id: genreId}});
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND)
    
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}, relations: ["genres"]});
        if (!show)
          throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
    
        const showGenre: GenreEntity = show.genres.find(e => e.id === genre.id);
    
        if (!showGenre)
            throw new BusinessLogicException("The genre with the given id is not associated to the show", BusinessError.PRECONDITION_FAILED)
 
        show.genres = show.genres.filter(e => e.id !== genreId);
        await this.showRepository.save(show);
    } 
}