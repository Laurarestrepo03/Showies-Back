/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WatchingService } from './watching.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchingEntity } from './watching.entity';
import { WatchingController } from './watching.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WatchingEntity])],
  providers: [WatchingService],
  controllers: [WatchingController],
})
export class WatchingModule {}
