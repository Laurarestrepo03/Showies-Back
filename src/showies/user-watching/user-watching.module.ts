/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserWatchingService } from './user-watching.service';
import { UserEntity } from '../user/user.entity';
import { WatchingEntity } from '../watching/watching.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWatchingController } from './user-watching.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, WatchingEntity])],
  providers: [UserWatchingService],
  controllers: [UserWatchingController]
})
export class UserWatchingModule {}
