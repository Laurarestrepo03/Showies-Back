/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { WatchingEntity } from '../watching/watching.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class UserWatchingService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    
        @InjectRepository(WatchingEntity)
        private readonly watchingRepository: Repository<WatchingEntity>
    ) {}

    async findWatchingsByUserId(userId: string): Promise<WatchingEntity[]> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["watching"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
       
        return user.watching;
    }
    
}
