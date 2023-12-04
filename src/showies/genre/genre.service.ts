/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreEntity } from './genre.entity';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(GenreEntity)
        private readonly genreRepository: Repository<GenreEntity>
    ){}

    async findAll(): Promise<GenreEntity[]> {
        return await this.genreRepository.find({ relations: ["shows"] });
    }

    async findOne(id: string): Promise<GenreEntity> {
        const genre: GenreEntity = await this.genreRepository.findOne({where: {id}, relations: ["shows"] } );
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
   
        return genre;
    }

    async create(genre: GenreEntity): Promise<GenreEntity> {
        return await this.genreRepository.save(genre);
    }

    async update(id: string, genre: GenreEntity): Promise<GenreEntity> {
        const persistedGenre: GenreEntity = await this.genreRepository.findOne({where:{id}});
        if (!persistedGenre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.genreRepository.save({...persistedGenre, ...genre});
    }

    async delete(id: string) {
        const genre: GenreEntity = await this.genreRepository.findOne({where:{id}});
        if (!genre)
          throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.genreRepository.remove(genre);
    }
}