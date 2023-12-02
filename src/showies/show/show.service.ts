/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ShowEntity } from './show.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class ShowService {
    
    constructor(
        @InjectRepository(ShowEntity)
        private readonly showRepository: Repository<ShowEntity>
    ){}

    async findAll(): Promise<ShowEntity[]> {
        return await this.showRepository.find({ relations: ["genres", "watching"] });
    }

    async findOne(id: string): Promise<ShowEntity> {
        const show: ShowEntity = await this.showRepository.findOne({where: {id}, relations: ["watching", "genres"] } );
        if (!show)
        throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND);

        return show;
    }

    async create(show: ShowEntity): Promise<ShowEntity> {
        return await this.showRepository.save(show);
    }

    async update(id: string, show: ShowEntity,): Promise<ShowEntity> {
        const persistedShow: ShowEntity = await this.showRepository.findOne({ where: { id } });
        if (!persistedShow)
            throw new BusinessLogicException('The show with the given id was not found', BusinessError.NOT_FOUND,);

        return await this.showRepository.save({...persistedShow,...show,});
    }
    async delete(id: string) {
        const show: ShowEntity = await this.showRepository.findOne({where:{id}});
        if (!show)
            throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND);

        await this.showRepository.remove(show);
    }
}
