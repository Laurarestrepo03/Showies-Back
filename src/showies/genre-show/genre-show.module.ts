/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShowEntity } from '../show/show.entity';  
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../genre/genre.entity';
import { GenreShowController } from './genre-show.controller';
import { GenreShowService } from './genre-show.service';

@Module({
    imports: [TypeOrmModule.forFeature([ShowEntity, GenreEntity])],
    providers: [GenreShowService],
    controllers:[GenreShowController]
})
export class GenreShowModule {}