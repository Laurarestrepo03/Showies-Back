/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShowEntity } from '../show/show.entity';  
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../genre/genre.entity';
import { ShowGenreController } from './show-genre.controller';
import { ShowGenreService } from './show-genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShowEntity, GenreEntity])],
  providers: [ShowGenreService],
  controllers: [ShowGenreController],
})
export class ShowGenreModule {}
