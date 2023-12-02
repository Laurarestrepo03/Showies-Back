/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { WatchingEntity } from '../watching/watching.entity';
import { ShowEntity } from '../show/show.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class ShowWatchingService {

    constructor(
        @InjectRepository(ShowEntity)
        private readonly showRepository: Repository<ShowEntity>,
    
        @InjectRepository(WatchingEntity)
        private readonly watchingRepository: Repository<WatchingEntity>
    ) {}

    async findWatchingsByShowId(showId: string): Promise<WatchingEntity[]> {
        const show: ShowEntity = await this.showRepository.findOne({where: {id: showId}, relations: ["watching", "genres"]});
        if (!show)
          throw new BusinessLogicException("The show with the given id was not found", BusinessError.NOT_FOUND)
       
        return show.watching;
    }
    
}
