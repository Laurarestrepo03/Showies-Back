/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowEntity } from './show.entity';
import { ShowController } from './show.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShowEntity])],
  providers: [ShowService],
  controllers: [ShowController],
})
export class ShowModule {}
