/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShowWatchingService } from './show-watching.service';
import { ShowEntity } from '../show/show.entity';
import { WatchingEntity } from '../watching/watching.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowWatchingController } from './show-watching.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShowEntity, WatchingEntity])],
  providers: [ShowWatchingService],
  controllers: [ShowWatchingController]
})
export class ShowWatchingModule {}
