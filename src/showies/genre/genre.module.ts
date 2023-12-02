/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './genre.entity';
import { GenreController } from './genre.controller';

@Module({
  providers: [GenreService],
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
})
export class GenreModule {}