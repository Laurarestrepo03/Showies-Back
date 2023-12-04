/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { WatchingEntity } from './watching.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class WatchingService {
    constructor(
        @InjectRepository(WatchingEntity)
        private readonly watchingRepository: Repository<WatchingEntity>
    ){}

    async findAll(): Promise<WatchingEntity[]> {
        return await this.watchingRepository.find({ relations: ["user", "show"] });
    }

    async findOne(userId: string, showId): Promise<WatchingEntity> {
        const watching: WatchingEntity = await this.watchingRepository.findOne({where: {userId, showId}, relations: ["user", "show"] } );
        if (!watching)
          throw new BusinessLogicException("The watching with the given user and show ids was not found", BusinessError.NOT_FOUND);
   
        return watching;
    }

    async create(watching: WatchingEntity): Promise<WatchingEntity> {
        return await this.watchingRepository.save(watching);
    }

    async update(userId: string, showId: string, watching: WatchingEntity): Promise<WatchingEntity> {
        const persistedWatching: WatchingEntity = await this.watchingRepository.findOne({where:{userId, showId}});
        if (!persistedWatching)
          throw new BusinessLogicException("The watching with the given user and show ids was not found", BusinessError.NOT_FOUND);
        
        return await this.watchingRepository.save({...persistedWatching, ...watching});
    }

    async delete(userId: string, showId: string) {
        const watching: WatchingEntity = await this.watchingRepository.findOne({where:{userId, showId}});
        if (!watching)
          throw new BusinessLogicException("The watching with the given user and show ids was not found", BusinessError.NOT_FOUND);
     
        await this.watchingRepository.remove(watching);
    }

}
